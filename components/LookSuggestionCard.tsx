import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
import { accessoryImages } from '../constants/accessoryImages';
import { globalStyles, spacing } from '../styles/global';
import { LookSuggestion } from '../types/suggestion';

interface LookSuggestionCardProps {
  suggestion: LookSuggestion;
}

export const LookSuggestionCard: React.FC<LookSuggestionCardProps> = ({ suggestion }) => {
  const { t } = useTranslation();
  const accessories = useMemo(() => {
    return suggestion.acessórios?.map((item, index) => {
      const icon = accessoryImages[item as keyof typeof accessoryImages];
      if (!icon) return null;

      return (
        <View key={index} style={globalStyles.accessoryIconWrapper}>
          <Image source={icon} style={globalStyles.accessoryIcon} resizeMode="contain" />
        </View>
      );
    });
  }, [suggestion.acessórios]);

  return (
    <View style={[globalStyles.cardhome, { marginTop: spacing.section }]}>
      <View style={globalStyles.suggestionWrapper}>
        <View style={globalStyles.suggestionMain}>
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
          <Text style={globalStyles.accessoryTitle}>{t('LookSuggestionCard.accessoryTitle')}</Text>
          {accessories}
        </View>
      </View>
    </View>
  );
};
