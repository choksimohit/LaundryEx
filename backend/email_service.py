import os
import asyncio
import logging
import resend
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()

# Configure Resend
resend.api_key = os.environ.get("RESEND_API_KEY")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "support@laundry-express.co.uk")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "support@laundry-express.co.uk")

logger = logging.getLogger(__name__)


def generate_order_confirmation_email(order_data: Dict) -> str:
    """Generate HTML email for order confirmation sent to customer"""
    
    items_html = ""
    for item in order_data["items"]:
        items_html += f"""
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
                <div style="font-weight: 500; color: #1e293b;">{item['product_name']}</div>
                <div style="font-size: 13px; color: #64748b;">{item.get('category', '')} {' > ' + item.get('subcategory', '') if item.get('subcategory') else ''}</div>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #64748b;">× {item['quantity']}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 500; color: #1e293b;">£{(item['price'] * item['quantity']):.2f}</td>
        </tr>
        """
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 600;">Order Confirmed! 🎉</h1>
                                <p style="margin: 12px 0 0 0; color: #dbeafe; font-size: 16px;">Thank you for choosing Laundry Express</p>
                            </td>
                        </tr>
                        
                        <!-- Order Details -->
                        <tr>
                            <td style="padding: 40px;">
                                <div style="background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="padding-bottom: 12px;">
                                                <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Order Number</div>
                                                <div style="font-size: 24px; font-weight: 700; color: #2563eb;">#{order_data['order_number']}</div>
                                            </td>
                                            <td style="padding-bottom: 12px; text-align: right;">
                                                <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Total Amount</div>
                                                <div style="font-size: 24px; font-weight: 700; color: #2563eb;">£{order_data['total_amount']:.2f}</div>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <!-- Order Items -->
                                <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #1e293b;">Order Items</h2>
                                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 32px;">
                                    <thead>
                                        <tr style="background-color: #f8fafc;">
                                            <th style="padding: 12px; text-align: left; font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase;">Item</th>
                                            <th style="padding: 12px; text-align: center; font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase;">Qty</th>
                                            <th style="padding: 12px; text-align: right; font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase;">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items_html}
                                    </tbody>
                                </table>
                                
                                <!-- Pickup & Delivery -->
                                <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #1e293b;">Pickup & Delivery Schedule</h2>
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                                    <tr>
                                        <td width="50%" style="padding-right: 12px;">
                                            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px;">
                                                <div style="font-size: 14px; color: #64748b; margin-bottom: 8px;">🧺 Pickup</div>
                                                <div style="font-size: 16px; font-weight: 600; color: #1e293b; margin-bottom: 4px;">{order_data['pickup_date']}</div>
                                                <div style="font-size: 14px; color: #64748b;">{order_data['pickup_time']}</div>
                                            </div>
                                        </td>
                                        <td width="50%" style="padding-left: 12px;">
                                            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px;">
                                                <div style="font-size: 14px; color: #64748b; margin-bottom: 8px;">🚚 Delivery</div>
                                                <div style="font-size: 16px; font-weight: 600; color: #1e293b; margin-bottom: 4px;">{order_data['delivery_date']}</div>
                                                <div style="font-size: 14px; color: #64748b;">{order_data['delivery_time']}</div>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Payment Method -->
                                <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; border-radius: 4px;">
                                    <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Payment Method</div>
                                    <div style="font-size: 16px; font-weight: 500; color: #1e293b; text-transform: capitalize;">{order_data['payment_method'].replace('_', ' ')}</div>
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #e2e8f0;">
                                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">Need help? Contact us</p>
                                <p style="margin: 0; color: #2563eb; font-size: 14px; font-weight: 500;">support@laundry-express.co.uk</p>
                                <p style="margin: 16px 0 0 0; color: #94a3b8; font-size: 12px;">© 2024 Laundry Express. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    return html


def generate_status_update_email(order_data: Dict, new_status: str) -> str:
    """Generate HTML email for order status update sent to customer"""
    
    status_messages = {
        "pending": "Your order has been received and is awaiting confirmation.",
        "confirmed": "Great news! Your order has been confirmed and we're preparing for pickup.",
        "processing": "Your items are being carefully processed by our team.",
        "completed": "Your order is complete and ready for delivery!",
        "cancelled": "Your order has been cancelled. If you have questions, please contact us."
    }
    
    status_colors = {
        "pending": "#f59e0b",
        "confirmed": "#2563eb",
        "processing": "#8b5cf6",
        "completed": "#10b981",
        "cancelled": "#ef4444"
    }
    
    status_icons = {
        "pending": "⏳",
        "confirmed": "✅",
        "processing": "⚙️",
        "completed": "🎉",
        "cancelled": "❌"
    }
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        <!-- Header -->
                        <tr>
                            <td style="background-color: {status_colors.get(new_status, '#2563eb')}; padding: 40px; text-align: center;">
                                <div style="font-size: 48px; margin-bottom: 16px;">{status_icons.get(new_status, '📦')}</div>
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Order Status Updated</h1>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px;">
                                <div style="background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 32px; text-align: center;">
                                    <div style="font-size: 14px; color: #64748b; margin-bottom: 8px;">Order Number</div>
                                    <div style="font-size: 28px; font-weight: 700; color: #2563eb; margin-bottom: 16px;">#{order_data['order_number']}</div>
                                    <div style="display: inline-block; background-color: {status_colors.get(new_status, '#2563eb')}; color: #ffffff; padding: 12px 24px; border-radius: 24px; font-size: 16px; font-weight: 600; text-transform: capitalize;">
                                        {new_status}
                                    </div>
                                </div>
                                
                                <p style="font-size: 16px; line-height: 1.6; color: #475569; text-align: center; margin: 0 0 32px 0;">
                                    {status_messages.get(new_status, 'Your order status has been updated.')}
                                </p>
                                
                                <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px;">
                                    <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #1e293b;">Order Details</h3>
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Total Amount</td>
                                            <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #1e293b;">£{order_data['total_amount']:.2f}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Pickup Date</td>
                                            <td style="padding: 8px 0; text-align: right; color: #1e293b;">{order_data['pickup_date']}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Delivery Date</td>
                                            <td style="padding: 8px 0; text-align: right; color: #1e293b;">{order_data['delivery_date']}</td>
                                        </tr>
                                    </table>
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #e2e8f0;">
                                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">Questions? We're here to help</p>
                                <p style="margin: 0; color: #2563eb; font-size: 14px; font-weight: 500;">support@laundry-express.co.uk</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    return html


def generate_admin_notification_email(order_data: Dict) -> str:
    """Generate HTML email for new order notification sent to admin"""
    
    items_html = ""
    for item in order_data["items"]:
        items_html += f"""
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #1e293b;">{item['product_name']}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #64748b;">× {item['quantity']}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #1e293b;">£{(item['price'] * item['quantity']):.2f}</td>
        </tr>
        """
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding: 40px; text-align: center;">
                                <div style="font-size: 48px; margin-bottom: 12px;">🔔</div>
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">New Order Received</h1>
                                <p style="margin: 12px 0 0 0; color: #e9d5ff; font-size: 14px;">Action required</p>
                            </td>
                        </tr>
                        
                        <!-- Order Info -->
                        <tr>
                            <td style="padding: 40px;">
                                <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin-bottom: 32px;">
                                    <div style="font-weight: 600; color: #92400e; margin-bottom: 4px;">⚠️ Pending Action</div>
                                    <div style="color: #92400e; font-size: 14px;">Please review and confirm this order in the admin panel</div>
                                </div>
                                
                                <div style="background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td>
                                                <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">Order Number</div>
                                                <div style="font-size: 24px; font-weight: 700; color: #7c3aed;">#{order_data['order_number']}</div>
                                            </td>
                                            <td style="text-align: right;">
                                                <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">Total</div>
                                                <div style="font-size: 24px; font-weight: 700; color: #7c3aed;">£{order_data['total_amount']:.2f}</div>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <!-- Customer Info -->
                                <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #1e293b;">Customer Information</h3>
                                <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Name</td>
                                            <td style="padding: 6px 0; text-align: right; color: #1e293b; font-weight: 500;">{order_data['user_name']}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Email</td>
                                            <td style="padding: 6px 0; text-align: right; color: #1e293b;">{order_data['user_email']}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Address</td>
                                            <td style="padding: 6px 0; text-align: right; color: #1e293b;">{order_data['address']}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Pin Code</td>
                                            <td style="padding: 6px 0; text-align: right; color: #1e293b;">{order_data['pin_code']}</td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <!-- Order Items -->
                                <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #1e293b;">Order Items</h3>
                                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 32px;">
                                    <thead>
                                        <tr style="background-color: #f8fafc;">
                                            <th style="padding: 10px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">Item</th>
                                            <th style="padding: 10px; text-align: center; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">Qty</th>
                                            <th style="padding: 10px; text-align: right; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items_html}
                                    </tbody>
                                </table>
                                
                                <!-- Schedule -->
                                <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #1e293b;">Pickup & Delivery Schedule</h3>
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td width="50%" style="padding-right: 12px;">
                                            <div style="border: 2px solid #e2e8f0; border-radius: 8px; padding: 16px;">
                                                <div style="font-size: 13px; color: #64748b; margin-bottom: 8px;">🧺 Pickup</div>
                                                <div style="font-weight: 600; color: #1e293b; margin-bottom: 4px;">{order_data['pickup_date']}</div>
                                                <div style="font-size: 14px; color: #64748b;">{order_data['pickup_time']}</div>
                                                {f'<div style="font-size: 13px; color: #64748b; margin-top: 8px; font-style: italic;">{order_data.get("pickup_instruction", "")}</div>' if order_data.get('pickup_instruction') else ''}
                                            </div>
                                        </td>
                                        <td width="50%" style="padding-left: 12px;">
                                            <div style="border: 2px solid #e2e8f0; border-radius: 8px; padding: 16px;">
                                                <div style="font-size: 13px; color: #64748b; margin-bottom: 8px;">🚚 Delivery</div>
                                                <div style="font-weight: 600; color: #1e293b; margin-bottom: 4px;">{order_data['delivery_date']}</div>
                                                <div style="font-size: 14px; color: #64748b;">{order_data['delivery_time']}</div>
                                                {f'<div style="font-size: 13px; color: #64748b; margin-top: 8px; font-style: italic;">{order_data.get("delivery_instruction", "")}</div>' if order_data.get('delivery_instruction') else ''}
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                                <p style="margin: 0; color: #64748b; font-size: 13px;">This is an automated notification from Laundry Express Admin System</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    return html


async def send_order_confirmation_email(order_data: Dict, recipient_email: str):
    """Send order confirmation email to customer"""
    try:
        html_content = generate_order_confirmation_email(order_data)
        
        params = {
            "from": SENDER_EMAIL,
            "to": [recipient_email],
            "subject": f"Order Confirmed - #{order_data['order_number']} | Laundry Express",
            "html": html_content
        }
        
        email = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Order confirmation email sent to {recipient_email}, email_id: {email.get('id')}")
        return {"status": "success", "email_id": email.get("id")}
    except Exception as e:
        logger.error(f"Failed to send order confirmation email: {str(e)}")
        return {"status": "error", "message": str(e)}


async def send_status_update_email(order_data: Dict, new_status: str, recipient_email: str):
    """Send order status update email to customer"""
    try:
        html_content = generate_status_update_email(order_data, new_status)
        
        params = {
            "from": SENDER_EMAIL,
            "to": [recipient_email],
            "subject": f"Order #{order_data['order_number']} - Status Updated to {new_status.title()} | Laundry Express",
            "html": html_content
        }
        
        email = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Status update email sent to {recipient_email}, email_id: {email.get('id')}")
        return {"status": "success", "email_id": email.get("id")}
    except Exception as e:
        logger.error(f"Failed to send status update email: {str(e)}")
        return {"status": "error", "message": str(e)}


async def send_admin_order_notification(order_data: Dict):
    """Send new order notification to admin"""
    try:
        html_content = generate_admin_notification_email(order_data)
        
        params = {
            "from": SENDER_EMAIL,
            "to": [ADMIN_EMAIL],
            "subject": f"🔔 New Order #{order_data['order_number']} - £{order_data['total_amount']:.2f} | Laundry Express",
            "html": html_content
        }
        
        email = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Admin notification email sent, email_id: {email.get('id')}")
        return {"status": "success", "email_id": email.get("id")}
    except Exception as e:
        logger.error(f"Failed to send admin notification email: {str(e)}")
        return {"status": "error", "message": str(e)}
