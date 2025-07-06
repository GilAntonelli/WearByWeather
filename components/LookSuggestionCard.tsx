
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { globalStyles, spacing } from '../styles/global';
import { accessoryImages } from '../constants/accessoryImages';
import { LookSuggestion } from '../types/suggestion';

interface Props {
  suggestion: LookSuggestion;
}

export const LookSuggestionCard = ({ suggestion }: Props) => {
  return (
    <View style={[globalStyles.cardhome, { marginTop: spacing.section }]}>
      <View style={globalStyles.suggestionWrapper}>
        <View style={{ flex: 1 }}>
          <Text style={globalStyles.lookText}>{suggestion.recomendação}</Text>
          <Image
            source={suggestion.image}
            style={globalStyles.avatar}
            resizeMode="contain"
          />

          <View style={globalStyles.tagRow}>
            <View style={globalStyles.tag}>
              <Text style={globalStyles.tagText}>{suggestion.roupaSuperior}</Text>
            </View>
            <View style={globalStyles.tag}>
              <Text style={globalStyles.tagText}>{suggestion.roupaInferior}</Text>
            </View>
          </View>
        </View>

        <View style={globalStyles.accessoryColumn}>
          <Text style={globalStyles.accessoryTitle}>Acessórios</Text>
          {suggestion.acessórios?.map((item, i) => {
            const icon = accessoryImages[item as keyof typeof accessoryImages];
            if (!icon) return null;

            return (
              <View key={i} style={globalStyles.accessoryIconWrapper}>
                <Image
                  source={icon}
                  style={globalStyles.accessoryIcon}
                  resizeMode="contain"
                />
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};
