from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.http import JsonResponse
from .views import ClienteViewSet, CompraViewSet, cliente_interface, api_root_redirect

router = DefaultRouter()
router.register(r'clientes', ClienteViewSet)
router.register(r'compras', CompraViewSet)

# Vista para la raíz
def root_view(request):
    return JsonResponse({"message": "Microservicio de Clientes en Python/Django"})

# Health check endpoint
def health_check(request):
    return JsonResponse({"status": "ok", "service": "clientes-service"})

urlpatterns = [
    # Ruta raíz
    path('', root_view, name='root'),
    
    # Interfaz de usuario
    path('interface/', cliente_interface, name='cliente-interface'),
    
    # Redireccionar la raíz de la API a la interfaz
    path('api/', api_root_redirect, name='api-root-redirect'),
    
    # Incluir todas las rutas generadas por el router para la API
    path('api/', include(router.urls)),
    
    # Health check
    path('health/', health_check, name='health'),
    
    # Añadir autenticación para la API navegable
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]