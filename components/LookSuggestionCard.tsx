import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { accessoryImages } from '../constants/accessoryImages';
import { globalStyles, spacing } from '../styles/global';
import { LookSuggestion } from '../types/suggestion';

// Styled Components personalizados
import {
  LookSuggestionContainer,
  LookRecommendation,
  LookAvatarContainer,
  LookAvatar,
  LookSectionTitle,
  LookAccessoryList,
  LookAccessoryIcon,
  LookSectionDivider,
  LookDescriptionText,
  LookAccessoryImage,
} from '../styles/global';

interface LookSuggestionCardProps {
  suggestion: LookSuggestion;
}

export const LookSuggestionCard: React.FC<LookSuggestionCardProps> = ({ suggestion }) => {
  const { t } = useTranslation();

  const [accessoryModalVisible, setAccessoryModalVisible] = useState(false);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Acessório atual selecionado
  const currentAccessory = suggestion.acessórios?.[selectedIndex];
  const currentAccessoryImage = currentAccessory
    ? accessoryImages[currentAccessory as keyof typeof accessoryImages]
    : null;

  // Modal de acessório: avançar para próximo
  const handleNext = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % (suggestion.acessórios?.length || 1));
  };

  // Modal de acessório: voltar ao anterior
  const handlePrev = () => {
    setSelectedIndex((prevIndex) =>
      (prevIndex - 1 + (suggestion.acessórios?.length || 1)) % (suggestion.acessórios?.length || 1)
    );
  };

  // Abrir modal ao clicar em um acessório
  const handleAccessoryClick = (index: number) => {
    setSelectedIndex(index);
    setAccessoryModalVisible(true);
  };

  // Lista de acessórios renderizada como ícones clicáveis
  const accessories = useMemo(() => {
    return suggestion.acessórios?.map((item, index) => {
      const icon = accessoryImages[item as keyof typeof accessoryImages];
      if (!icon) return null;

      return (
        <TouchableOpacity
          key={index}
          onPress={() => handleAccessoryClick(index)}
          style={globalStyles.accessoryIconWrapper}
        >
          <Image source={icon} style={globalStyles.accessoryIcon} resizeMode="contain" />
        </TouchableOpacity>
      );
    });
  }, [suggestion.acessórios]);

  return (
    <View style={[globalStyles.cardhome, { marginTop: spacing.section }]}>

      {/* MODAL: Acessórios */}
      <Modal visible={accessoryModalVisible} transparent animationType="slide">
        <Pressable
          style={globalStyles.modalOverlay}
          onPress={() => setAccessoryModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={globalStyles.modalContentWrapper}
          >
            <View style={globalStyles.modalContent} onStartShouldSetResponder={() => true}>
              <Text style={globalStyles.modalTitle}>{t('LookSuggestionCard.accessoryTitle')}</Text>
              {currentAccessoryImage && (
                <>
                  <Image source={currentAccessoryImage} style={globalStyles.modalImage} resizeMode="contain" />
                  <Text style={globalStyles.modalAccessoryLabel}>
                    {t(`accessoryNames.${currentAccessory}`)}
                  </Text>
                </>
              )}
              <View style={globalStyles.modalButtonRow}>
                <TouchableOpacity onPress={handlePrev} style={globalStyles.modalNavButton}>
                  <Text style={globalStyles.modalButtonText}>◀</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNext} style={globalStyles.modalNavButton}>
                  <Text style={globalStyles.modalButtonText}>▶</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setAccessoryModalVisible(false)} style={globalStyles.modalCloseButton}>
                <Text style={globalStyles.button}>{t('buttons.close')}</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      {/* MODAL: Avatar Expandido */}
      <Modal visible={avatarModalVisible} transparent animationType="fade">
        <Pressable
          style={globalStyles.modalOverlay}
          onPress={() => setAvatarModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={globalStyles.modalContentWrapper}
          >
            <View style={globalStyles.modalContent} onStartShouldSetResponder={() => true}>
              <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                <Text style={globalStyles.modalTitle}>{t('textLookDescription')}</Text>
                {/* <Image source={suggestion.image} style={globalStyles.modalImage} resizeMode="contain" /> */}
                <Text style={globalStyles.lookText}>{suggestion.recommendation}</Text>
                {/* <View style={globalStyles.lookText}>
                  {suggestion.roupaSuperior && <Text style={globalStyles.tagText}>{suggestion.roupaSuperior}</Text>}
                  {suggestion.roupaInferior && <Text style={globalStyles.tagText}>{suggestion.roupaInferior}</Text>}
                  {suggestion.shoes && <Text style={globalStyles.tagText}>{suggestion.shoes}</Text>}
                </View> */}
                <TouchableOpacity onPress={() => setAvatarModalVisible(false)} style={globalStyles.modalCloseButton}>
                  <Text style={globalStyles.button}>{t('buttons.close')}</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      {/* CONTEÚDO PRINCIPAL DO CARTÃO */}

      <View style={globalStyles.suggestionWrapper}>
        <View style={globalStyles.suggestionMain}>
          <TouchableOpacity onPress={() => setAvatarModalVisible(true)}>
            <Image source={suggestion.image} style={globalStyles.avatar} resizeMode="contain" />
          </TouchableOpacity>


        </View>

        <View style={globalStyles.accessoryColumn}>
          <Text style={globalStyles.accessoryTitle}>{t('LookSuggestionCard.accessoryTitle')}</Text>
          {accessories}
        </View>
      </View>

      <LookSectionDivider />
      <View style={globalStyles.lookText}>
        {suggestion.roupaSuperior && <Text style={globalStyles.tagText}>{suggestion.roupaSuperior}</Text>}
        {suggestion.roupaInferior && <Text style={globalStyles.tagText}>{suggestion.roupaInferior}</Text>}
        {suggestion.shoes && <Text style={globalStyles.tagText}>{suggestion.shoes}</Text>}
      </View>
    </View>
  );
};
