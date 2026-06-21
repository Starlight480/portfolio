# NEXUS Contact API — Render Deployment Configuration
# Deploy as a Web Service on Render.com (free tier)

# Build Command:
pip install -r requirements.txt

# Start Command:
gunicorn server:app --bind 0.0.0.0:$PORT --workers 2 --timeout 30

# Environment Variables (set in Render dashboard):
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-gmail@gmail.com
# SMTP_PASS=your-gmail-app-password
# RECIPIENT_EMAIL=inaisrael2009@gmail.com

# Health Check Path: /api/health
