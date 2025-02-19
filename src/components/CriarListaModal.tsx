import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';


interface CriarListaModalProps {
  visible: boolean;
  onClose: () => void;
  onAddLista: (nomeLista: string) => void;
}

const CriarListaModal: React.FC<CriarListaModalProps> = ({ visible, onClose, onAddLista }) => {
  const [nomeLista, setNomeLista] = useState('');

  const handleCreateLista = () => {
    if (!nomeLista) {
      Alert.alert('Aviso', 'Digite um nome para a lista');
      return;
    }
    onAddLista(nomeLista);
    setNomeLista('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Criar Nova Lista</Text>
          <TextInput
            placeholder="Nome da Lista"
            value={nomeLista}
            onChangeText={setNomeLista}
            style={styles.input}
          />
          <Button title="Criar Lista" onPress={handleCreateLista} />
          <Button title="Cancelar" onPress={onClose} color="gray" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: 300,
    borderRadius: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
});

export default CriarListaModal;
