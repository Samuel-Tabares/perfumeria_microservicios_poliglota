from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet, CompraViewSet
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

router = DefaultRouter()
router.register(r'clientes', ClienteViewSet)
router.register(r'compras', CompraViewSet)

# Endpoint de salud para verificación del servicio
def health_check(request):
    return JsonResponse({"status": "ok", "service": "clientes-service"})

# Endpoint raíz para API
@api_view(['GET'])
def api_root(request):
    return Response({
        "message": "API de Clientes funcionando",
        "endpoints": [
            "/api/clientes/",
            "/api/compras/"
        ]
    })

# Endpoint raíz
def root(request):
    return JsonResponse({
        "message": "Microservicio de Clientes en Python/Django"
    })

urlpatterns = [
    path('', root, name='root'),
    path('api/', include(router.urls)),  # Incluye las rutas del router para /api/
    path('health/', health_check, name='health'),
]