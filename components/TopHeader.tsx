import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { globalStyles } from '../styles/global'; // Se estiver usando estilo centralizado
 

interface Props {
  title?: string;
  renderAnchor?: () => React.ReactNode;
}

export const TopHeader = ({ title, renderAnchor }: Props) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        {renderAnchor && renderAnchor()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: Platform.OS === 'ios' ? 48 : 32,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
});
