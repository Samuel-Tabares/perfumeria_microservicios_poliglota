from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.shortcuts import render, redirect
from rest_framework.renderers import TemplateHTMLRenderer, JSONRenderer
from .models import Cliente, Compra
from .serializers import ClienteSerializer, ClienteSimpleSerializer, CompraSerializer

# Vista para la interfaz de usuario
def cliente_interface(request):
    """Vista para renderizar la interfaz de usuario de clientes"""
    return render(request, 'clientes/index.html')

# Vista para redireccionar la raíz de la API a la interfaz
@api_view(['GET'])
def api_root_redirect(request):
    return redirect('cliente-interface')

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