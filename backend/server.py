from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import stripe
from email_service import send_order_confirmation_email, send_status_update_email, send_admin_order_notification

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')
JWT_SECRET = os.environ.get('JWT_SECRET')
JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

app = FastAPI()
api_router = APIRouter(prefix="/api")

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str
    phone: str
    role: str
    created_at: str

class PinCodeCheck(BaseModel):
    pin_code: str

class PinCodeResponse(BaseModel):
    available: bool
    businesses: List[dict] = []

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    business_id: str
    business_name: str
    service_type: str
    category: str
    subcategory: Optional[str] = None
    name: str
    price: float
    icon_url: Optional[str] = None
    sort_order: Optional[int] = None
    category_sort_order: Optional[int] = None
    subcategory_sort_order: Optional[int] = None

class CartItem(BaseModel):
    product_id: str
    product_name: str
    category: str
    subcategory: Optional[str] = None
    business_id: str
    business_name: str
    price: float
    quantity: int

class OrderCreate(BaseModel):
    items: List[CartItem]
    pickup_date: str
    pickup_time: str
    pickup_instruction: str
    delivery_date: str
    delivery_time: str
    delivery_instruction: str
    address: str
    pin_code: str
    payment_method: str
    total_amount: float

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    items: List[dict]
    pickup_date: str
    pickup_time: str
    delivery_date: str
    delivery_time: str
    address: str
    pin_code: str
    payment_method: str
    payment_status: str
    total_amount: float
    status: str
    created_at: str

class Business(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    owner_email: str
    pin_codes: List[str]
    created_at: str

class BusinessCreate(BaseModel):
    name: str
    owner_email: str
    pin_codes: List[str]

class ProductCreate(BaseModel):
    business_id: str
    service_type: str
    category: str
    subcategory: Optional[str] = None
    name: str
    price: float
    icon_url: Optional[str] = None
    sort_order: Optional[int] = None

class OrderStatusUpdate(BaseModel):
    status: str

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_admin_user(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["business_admin", "platform_admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "name": user_data.name,
        "phone": user_data.phone,
        "role": "customer",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    
    token = create_access_token({"sub": user_id, "email": user_data.email, "role": "customer"})
    return {"token": token, "user": {"id": user_id, "email": user_data.email, "name": user_data.name, "role": "customer"}}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user["id"], "email": user["email"], "role": user["role"]})
    return {"token": token, "user": {"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"]}}

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {"id": current_user["id"], "email": current_user["email"], "name": current_user["name"], "role": current_user["role"]}

@api_router.post("/pincode/check", response_model=PinCodeResponse)
async def check_pincode(data: PinCodeCheck):
    businesses = await db.businesses.find(
        {"pin_codes": data.pin_code},
        {"_id": 0}
    ).to_list(100)
    
    return {
        "available": len(businesses) > 0,
        "businesses": businesses
    }

@api_router.get("/products")
async def get_products(business_id: Optional[str] = None, category: Optional[str] = None, subcategory: Optional[str] = None):
    query = {}
    if business_id:
        query["business_id"] = business_id
    if category:
        query["category"] = category
    if subcategory:
        query["subcategory"] = subcategory
    
    products = await db.products.find(query, {"_id": 0}).sort([("sort_order", 1), ("name", 1)]).to_list(1000)
    return products

@api_router.get("/service-types")
async def get_service_types():
    pipeline = [
        {"$group": {"_id": "$service_type"}},
        {"$project": {"_id": 0, "name": "$_id"}}
    ]
    service_types = await db.products.aggregate(pipeline).to_list(100)
    return service_types

@api_router.get("/categories")
async def get_categories():
    pipeline = [
        {"$group": {"_id": "$category"}},
        {"$sort": {"_id": 1}},
        {"$project": {"_id": 0, "name": "$_id"}}
    ]
    categories = await db.products.aggregate(pipeline).to_list(100)
    return categories

@api_router.post("/orders")
async def create_order(order_data: OrderCreate, current_user: dict = Depends(get_current_user)):
    if order_data.total_amount < 30:
        raise HTTPException(status_code=400, detail="Minimum order value is £30")
    
    order_id = str(uuid.uuid4())
    
    # Generate 6-digit numeric order number
    last_order = await db.orders.find({}, {"_id": 0, "order_number": 1}).sort("order_number", -1).limit(1).to_list(1)
    order_number = (last_order[0]["order_number"] + 1) if last_order and "order_number" in last_order[0] else 100000
    
    order_doc = {
        "id": order_id,
        "order_number": order_number,
        "user_id": current_user["id"],
        "user_name": current_user["name"],
        "user_email": current_user["email"],
        "items": [item.model_dump() for item in order_data.items],
        "pickup_date": order_data.pickup_date,
        "pickup_time": order_data.pickup_time,
        "pickup_instruction": order_data.pickup_instruction,
        "delivery_date": order_data.delivery_date,
        "delivery_time": order_data.delivery_time,
        "delivery_instruction": order_data.delivery_instruction,
        "address": order_data.address,
        "pin_code": order_data.pin_code,
        "payment_method": order_data.payment_method,
        "payment_status": "pending" if order_data.payment_method == "stripe" else "cod",
        "total_amount": order_data.total_amount,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.orders.insert_one(order_doc)
    
    # Send confirmation email to customer
    try:
        await send_order_confirmation_email(order_doc, current_user["email"])
    except Exception as e:
        print(f"Failed to send customer confirmation email: {e}")
    
    # Send notification email to admin
    try:
        await send_admin_order_notification(order_doc)
    except Exception as e:
        print(f"Failed to send admin notification email: {e}")
    
    return {"order_id": order_id, "order_number": order_number, "status": "success"}

@api_router.post("/payment/create-intent")
async def create_payment_intent(data: dict, current_user: dict = Depends(get_current_user)):
    try:
        intent = stripe.PaymentIntent.create(
            amount=int(data["amount"] * 100),
            currency="gbp",
            metadata={"order_id": data.get("order_id")}
        )
        return {"client_secret": intent.client_secret}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/orders")
async def get_orders(current_user: dict = Depends(get_current_user)):
    query = {"user_id": current_user["id"]} if current_user["role"] == "customer" else {}
    orders = await db.orders.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return orders

@api_router.get("/orders/{order_id}")
async def get_order(order_id: str, current_user: dict = Depends(get_current_user)):
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if current_user["role"] == "customer" and order["user_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    return order

@api_router.patch("/admin/orders/{order_id}/status")
async def update_order_status(order_id: str, data: OrderStatusUpdate, admin: dict = Depends(get_admin_user)):
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": data.status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"status": "success"}

@api_router.get("/admin/businesses")
async def get_businesses(admin: dict = Depends(get_admin_user)):
    businesses = await db.businesses.find({}, {"_id": 0}).to_list(1000)
    return businesses

@api_router.post("/admin/businesses")
async def create_business(business_data: BusinessCreate, admin: dict = Depends(get_admin_user)):
    if admin["role"] not in ["platform_admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Platform admin access required")
    
    business_id = str(uuid.uuid4())
    business_doc = {
        "id": business_id,
        "name": business_data.name,
        "owner_email": business_data.owner_email,
        "pin_codes": business_data.pin_codes,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.businesses.insert_one(business_doc)
    return {"business_id": business_id, "status": "success"}

@api_router.get("/admin/products")
async def get_admin_products(admin: dict = Depends(get_admin_user)):
    products = await db.products.find({}, {"_id": 0}).to_list(1000)
    return products

@api_router.post("/admin/products")
async def create_product(product_data: ProductCreate, admin: dict = Depends(get_admin_user)):
    business = await db.businesses.find_one({"id": product_data.business_id}, {"_id": 0})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    product_id = str(uuid.uuid4())
    
    # Get max sort_order for this subcategory if not provided
    if product_data.sort_order is None:
        subcategory_filter = {"category": product_data.category, "subcategory": product_data.subcategory}
        max_product = await db.products.find(subcategory_filter, {"_id": 0}).sort("sort_order", -1).limit(1).to_list(1)
        product_data.sort_order = (max_product[0].get("sort_order", 0) + 1) if max_product else 0
    
    product_doc = {
        "id": product_id,
        "business_id": product_data.business_id,
        "business_name": business["name"],
        "service_type": product_data.service_type,
        "category": product_data.category,
        "subcategory": product_data.subcategory,
        "name": product_data.name,
        "price": product_data.price,
        "icon_url": product_data.icon_url,
        "sort_order": product_data.sort_order,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.products.insert_one(product_doc)
    return {"product_id": product_id, "status": "success"}

@api_router.put("/admin/products/{product_id}")
async def update_product(product_id: str, product_data: ProductCreate, admin: dict = Depends(get_admin_user)):
    business = await db.businesses.find_one({"id": product_data.business_id}, {"_id": 0})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    update_doc = {
        "business_id": product_data.business_id,
        "business_name": business["name"],
        "service_type": product_data.service_type,
        "category": product_data.category,
        "subcategory": product_data.subcategory,
        "name": product_data.name,
        "price": product_data.price,
        "icon_url": product_data.icon_url,
    }
    
    if product_data.sort_order is not None:
        update_doc["sort_order"] = product_data.sort_order
    
    result = await db.products.update_one(
        {"id": product_id},
        {"$set": update_doc}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"status": "success"}

@api_router.delete("/admin/products/{product_id}")
async def delete_product(product_id: str, admin: dict = Depends(get_admin_user)):
    result = await db.products.delete_one({"id": product_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"status": "success"}

@api_router.get("/admin/orders")
async def get_admin_orders(admin: dict = Depends(get_admin_user)):
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return orders

@api_router.get("/admin/stats")
async def get_admin_stats(admin: dict = Depends(get_admin_user)):
    total_orders = await db.orders.count_documents({})
    total_revenue = await db.orders.aggregate([
        {"$group": {"_id": None, "total": {"$sum": "$total_amount"}}}
    ]).to_list(1)
    total_businesses = await db.businesses.count_documents({})
    total_products = await db.products.count_documents({})
    
    revenue = total_revenue[0]["total"] if total_revenue else 0
    
    return {
        "total_orders": total_orders,
        "total_revenue": revenue,
        "total_businesses": total_businesses,
        "total_products": total_products
    }

@api_router.post("/admin/products/reorder")
async def reorder_products(data: dict, admin: dict = Depends(get_admin_user)):
    updates = data.get("updates", [])
    
    for update in updates:
        product_id = update.get("id")
        sort_order = update.get("sort_order")
        
        if product_id and sort_order is not None:
            await db.products.update_one(
                {"id": product_id},
                {"$set": {"sort_order": sort_order}}
            )
    
    return {"status": "success", "updated": len(updates)}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()