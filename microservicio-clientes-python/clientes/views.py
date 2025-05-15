from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Cliente, Compra
from .serializers import ClienteSerializer, ClienteSimpleSerializer, CompraSerializer
# Importa render
from django.shortcuts import render

# Añade esta función a tus vistas
def cliente_interface(request):
    return render(request, 'clientes/index.html')
class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ClienteSimpleSerializer
        return ClienteSerializer
    
    @action(detail=True, methods=['get'])
    def compras(self, request, pk=None):
        cliente = self.get_object()
        compras = cliente.compras.all()
        serializer = CompraSerializer(compras, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def activos(self, request):
        clientes_activos = Cliente.objects.filter(activo=True)
        serializer = ClienteSimpleSerializer(clientes_activos, many=True)
        return Response(serializer.data)

class CompraViewSet(viewsets.ModelViewSet):
    queryset = Compra.objects.all()
    serializer_class = CompraSerializer
    
    def create(self, request, *args, **kwargs):
        cliente_id = request.data.get('cliente')
        
        try:
            cliente = Cliente.objects.get(id=cliente_id)
        except Cliente.DoesNotExist:
            return Response(
                {'error': f'Cliente con ID {cliente_id} no existe'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return super().create(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'])
    def completar(self, request, pk=None):
        compra = self.get_object()
        compra.completada = True
        compra.save()
        return Response({'status': 'Compra completada'}, status=status.HTTP_200_OK)