import React, { useState } from 'react';
import { View,Text, TextInput,TouchableOpacity, FlatList, ScrollView, StyleSheet,
} from 'react-native';

export default function App() {
  const [tela, setTela] = useState('menu');
  const [mensagem, setMensagem] = useState('');

  const [produtos] = useState([
    { id: '1', categoria: 'Pizza', nome: 'Calabresa', tamanho: 'Broto', preco: 28 },
    { id: '2', categoria: 'Pizza', nome: 'Calabresa', tamanho: 'Média', preco: 38 },
    { id: '3', categoria: 'Pizza', nome: 'Calabresa', tamanho: 'Grande', preco: 48 },
    { id: '4', categoria: 'Pizza', nome: 'Mussarela', tamanho: 'Broto', preco: 26 },
    { id: '5', categoria: 'Pizza', nome: 'Mussarela', tamanho: 'Média', preco: 36 },
    { id: '6', categoria: 'Pizza', nome: 'Mussarela', tamanho: 'Grande', preco: 46 },
    { id: '7', categoria: 'Pizza', nome: 'Portuguesa', tamanho: 'Grande', preco: 52 },
    { id: '8', categoria: 'Bebida', nome: 'Refrigerante Lata', tamanho: '350ml', preco: 6 },
    { id: '9', categoria: 'Bebida', nome: 'Refrigerante 2L', tamanho: '2 Litros', preco: 14 },
    { id: '10', categoria: 'Bebida', nome: 'Suco Natural', tamanho: '500ml', preco: 10 },
  ]);

  const [quantidades, setQuantidades] = useState({});
  const [pedido, setPedido] = useState([]);

  function alterarQuantidade(id, valor) {
    setQuantidades({
      ...quantidades,
      [id]: valor,
    });
  }

  function adicionarAoPedido(item) {
    const quantidadeEscolhida = quantidades[item.id] * 1 || 1;

    if (quantidadeEscolhida < 1) {
      setMensagem('Digite uma quantidade maior que 0.');
      return;
    }

    const novoPedido = [...pedido];
    let achou = false;

    for (let i = 0; i < novoPedido.length; i++) {
      if (novoPedido[i].id == item.id) {
        novoPedido[i].quantidade = novoPedido[i].quantidade + quantidadeEscolhida;
        achou = true;
      }
    }

    if (achou == false) {
      novoPedido.push({
        id: item.id,
        categoria: item.categoria,
        nome: item.nome,
        tamanho: item.tamanho,
        preco: item.preco,
        quantidade: quantidadeEscolhida,
      });
    }

    setPedido(novoPedido);
    setMensagem('Adicionado: ' + quantidadeEscolhida + 'x ' + item.nome + ' (' + item.tamanho + ')');
  }

  function removerItem(id) {
    const listaAtualizada = [];

    for (let i = 0; i < pedido.length; i++) {
      if (pedido[i].id !== id) {
        listaAtualizada.push(pedido[i]);
      }
    }

    setPedido(listaAtualizada);
    setMensagem('Item removido do pedido.');
  }

  function calcularTotal() {
    let total = 0;

    for (let i = 0; i < pedido.length; i++) {
      total = total + pedido[i].preco * pedido[i].quantidade;
    }

    return total;
  }

  function confirmarFinalizacao() {
    setPedido([]);
    setQuantidades({});
    setMensagem('Pedido finalizado com sucesso!');
    setTela('menu');
  }

  function BotaoVoltar() {
    return (
      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => {
          setMensagem('');
          setTela('menu');
        }}
      >
        <Text style={styles.textoBotao}>Voltar ao Menu Inicial</Text>
      </TouchableOpacity>
    );
  }

  if (tela == 'menu') {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Pizzaria — Controle de Pedidos</Text>
        <Text style={styles.subtitulo}>Itens no pedido: {pedido.length}</Text>

        {mensagem !== '' && <Text style={styles.mensagem}>{mensagem}</Text>}

        <TouchableOpacity
          style={styles.botaoMenu}
          onPress={() => {
            setMensagem('');
            setTela('produtos');
          }}
        >
          <Text style={styles.textoBotao}>Visualizar Produtos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoMenu}
          onPress={() => {
            setMensagem('');
            setTela('pedido');
          }}
        >
          <Text style={styles.textoBotao}>Visualizar Itens do Pedido</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoMenu}
          onPress={() => {
            setMensagem('');
            setTela('remover');
          }}
        >
          <Text style={styles.textoBotao}>Remover Itens do Pedido</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoFinalizarMenu}
          onPress={() => {
            setMensagem('');
            setTela('finalizar');
          }}
        >
          <Text style={styles.textoBotao}>Finalizar Pedido</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (tela == 'produtos') {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Produtos</Text>
        {mensagem !== '' && <Text style={styles.mensagem}>{mensagem}</Text>}

        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cartao}>
              <Text style={styles.nomeItem}>
                {item.categoria}: {item.nome} ({item.tamanho})
              </Text>
              <Text style={styles.precoItem}>R$ {item.preco}</Text>

              <View style={styles.linhaQtd}>
                <Text style={styles.rotuloQtd}>Quantidade:</Text>
                <TextInput
                  style={styles.inputQtd}
                  keyboardType="numeric"
                  placeholder="1"
                  value={quantidades[item.id] || ''}
                  onChangeText={(texto) => alterarQuantidade(item.id, texto)}
                />
                <TouchableOpacity
                  style={styles.botaoAdicionar}
                  onPress={() => adicionarAoPedido(item)}
                >
                  <Text style={styles.textoBotao}>Selecionar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <BotaoVoltar />
      </View>
    );
  }

  if (tela == 'pedido') {
    return (
      <ScrollView style={styles.containerScroll}>
        <Text style={styles.titulo}>Itens do Pedido</Text>

        {pedido.length == 0 ? (
          <Text style={styles.textoVazio}>Nenhum item adicionado ainda.</Text>
        ) : (
          pedido.map((item) => (
            <View key={item.id} style={styles.cartao}>
              <Text style={styles.nomeItem}>
                {item.quantidade}x {item.nome} ({item.tamanho})
              </Text>
              <Text style={styles.precoItem}>
                Subtotal: R$ {item.preco * item.quantidade}
              </Text>
            </View>
          ))
        )}

        <Text style={styles.totalTexto}>Total: R$ {calcularTotal()}</Text>
        <BotaoVoltar />
      </ScrollView>
    );
  }

  if (tela == 'remover') {
    return (
      <ScrollView style={styles.containerScroll}>
        <Text style={styles.titulo}>Remover Itens do Pedido</Text>
        {mensagem !== '' && <Text style={styles.mensagem}>{mensagem}</Text>}

        {pedido.length == 0 ? (
          <Text style={styles.textoVazio}>Não há itens no pedido para remover.</Text>
        ) : (
          pedido.map((item) => (
            <View key={item.id} style={styles.cartao}>
              <Text style={styles.nomeItem}>
                {item.quantidade}x {item.nome} ({item.tamanho})
              </Text>
              <TouchableOpacity
                style={styles.botaoRemover}
                onPress={() => removerItem(item.id)}
              >
                <Text style={styles.textoBotao}>Remover</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <BotaoVoltar />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.containerScroll}>
      <Text style={styles.titulo}>Finalizar Pedido</Text>

      {pedido.length == 0 ? (
        <Text style={styles.textoVazio}>Seu pedido está vazio.</Text>
      ) : (
        <View>
          {pedido.map((item) => (
            <View key={item.id} style={styles.cartao}>
              <Text style={styles.nomeItem}>
                {item.quantidade}x {item.nome} ({item.tamanho})
              </Text>
              <Text style={styles.precoItem}>
                R$ {item.preco * item.quantidade}
              </Text>
            </View>
          ))}

          <Text style={styles.totalTexto}>Total a pagar: R$ {calcularTotal()}</Text>

          <TouchableOpacity
            style={styles.botaoConfirmar}
            onPress={confirmarFinalizacao}
          >
            <Text style={styles.textoBotao}>Confirmar e Finalizar</Text>
          </TouchableOpacity>
        </View>
      )}

      <BotaoVoltar />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 45,
    backgroundColor: '#f5f5f5',
  },
  containerScroll: {
    flex: 1,
    padding: 20,
    paddingTop: 45,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 15,
    marginBottom: 16,
    textAlign: 'center',
  },
  mensagem: {
    backgroundColor: '#e0f2fe',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    textAlign: 'center',
  },
  botaoMenu: {
    backgroundColor: '#2563eb',
    padding: 17,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  botaoFinalizarMenu: {
    backgroundColor: '#16a34a',
    padding: 20,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  cartao: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  nomeItem: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  precoItem: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  linhaQtd: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rotuloQtd: {
    fontSize: 14,
    marginRight: 8,
  },
  inputQtd: {
    width: 60,
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 6,
    padding: 6,
    marginRight: 10,
    backgroundColor: '#ffffff',
    textAlign: 'center',
  },
  botaoAdicionar: {
    backgroundColor: '#16a34a',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  botaoRemover: {
    backgroundColor: '#dc2626',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  botaoConfirmar: {
    backgroundColor: '#16a34a',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoVoltar: {
    backgroundColor: '#4b5563',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 30,
  },
  textoBotao: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  textoVazio: {
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 20,
  },
  totalTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'right',
  },
});