FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8001

# Asegúrate de que el puerto esté correctamente configurado
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8001"]