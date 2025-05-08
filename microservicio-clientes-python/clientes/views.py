from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Cliente, Compra
from .serializers import ClienteSerializer, ClienteSimpleSerializer, CompraSerializer

class ClienteViewSet(viewsets.ModelViewSet):
    """
    API endpoint para visualizar y editar clientes
    """
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    
    def get_serializer_class(self):
        """
        Retorna serializer simple para operaciones de lista
        """
        if self.action == 'list':
            return ClienteSimpleSerializer
        return ClienteSerializer
    
    @action(detail=True, methods=['get'])
    def compras(self, request, pk=None):
        """
        Endpoint para obtener las compras de un cliente específico
        URL: /api/clientes/{id}/compras/
        """
        cliente = self.get_object()
        compras = cliente.compras.all()
        serializer = CompraSerializer(compras, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def activos(self, request):
        """
        Endpoint para obtener solo clientes activos
        URL: /api/clientes/activos/
        """
        clientes_activos = Cliente.objects.filter(activo=True)
        serializer = ClienteSimpleSerializer(clientes_activos, many=True)
        return Response(serializer.data)

class CompraViewSet(viewsets.ModelViewSet):
    """
    API endpoint para visualizar y editar compras
    """
    queryset = Compra.objects.all()
    serializer_class = CompraSerializer
    
    # Método para manejar explícitamente la creación de compras
    def create(self, request, *args, **kwargs):
        """
        Crea una nueva compra verificando que el cliente exista
        """
        cliente_id = request.data.get('cliente')
        
        # Verifica que el cliente exista antes de continuar
        try:
            cliente = Cliente.objects.get(id=cliente_id)
        except Cliente.DoesNotExist:
            return Response(
                {'error': f'Cliente con ID {cliente_id} no existe'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Continúa con la creación normal
        return super().create(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'])
    def completar(self, request, pk=None):
        """
        Endpoint para marcar una compra como completada
        URL: /api/compras/{id}/completar/
        """
        compra = self.get_object()
        compra.completada = True
        compra.save()
        return Response({'status': 'Compra completada'}, status=status.HTTP_200_OK)