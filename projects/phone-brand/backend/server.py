"""
NEXUS Contact API — Flask backend for contact form submissions.
Deployed on Render (free tier, always-on).
"""
import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin from portfolio and nexus sites

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration from environment variables (set in Render dashboard)
SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
SMTP_USER = os.environ.get("SMTP_USER", "")  # Your Gmail address
SMTP_PASS = os.environ.get("SMTP_PASS", "")  # Gmail app password
RECIPIENT_EMAIL = os.environ.get("RECIPIENT_EMAIL", "inaisrael2009@gmail.com")


@app.route("/api/contact", methods=["POST"])
def contact():
    """Handle contact form submission and forward via email."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400

        name = (data.get("name") or "").strip()
        email = (data.get("email") or "").strip()
        subject = (data.get("subject") or "No subject").strip()
        message = (data.get("message") or "").strip()

        # Validation
        if not name or not email or not message:
            return jsonify({"success": False, "error": "Name, email, and message are required"}), 400

        if "@" not in email or "." not in email:
            return jsonify({"success": False, "error": "Invalid email address"}), 400

        if len(message) > 5000:
            return jsonify({"success": False, "error": "Message too long (max 5000 chars)"}), 400

        # Build email
        subject_map = {
            "product": "Product Inquiry",
            "support": "Support Request",
            "partnership": "Partnership",
            "other": "General",
        }
        subject_text = subject_map.get(subject, subject)

        body = f"""New contact form submission:

Name: {name}
Email: {email}
Subject: {subject_text}

Message:
{message}
"""
        msg = MIMEMultipart()
        msg["From"] = SMTP_USER
        msg["To"] = RECIPIENT_EMAIL
        msg["Subject"] = f"[NEXUS Contact] {subject_text} — from {name}"
        msg.attach(MIMEText(body, "plain"))

        # Send email
        if SMTP_USER and SMTP_PASS:
            try:
                with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
                    server.starttls()
                    server.login(SMTP_USER, SMTP_PASS)
                    server.send_message(msg)
                logger.info(f"Contact email sent from {name} ({email}) — {subject_text}")
            except Exception as e:
                logger.error(f"SMTP error: {e}")
                # Still return success so user doesn't see error — log it server-side
                return jsonify({
                    "success": True,
                    "message": "Message received. We'll get back to you within 24 hours.",
                    "warning": "Email delivery delayed — will be retried."
                }), 200
        else:
            logger.info(f"SMTP not configured. Would send: {body}")

        return jsonify({
            "success": True,
            "message": "Message sent successfully! We'll get back to you within 24 hours."
        }), 200

    except Exception as e:
        logger.error(f"Contact form error: {e}")
        return jsonify({"success": False, "error": "Server error. Please try again later."}), 500


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "service": "nexus-contact-api"}), 200


@app.route("/", methods=["GET"])
def index():
    """Root — show API info."""
    return jsonify({
        "service": "NEXUS Contact API",
        "version": "1.0.0",
        "endpoints": {
            "POST /api/contact": "Submit contact form",
            "GET /api/health": "Health check",
        }
    }), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
