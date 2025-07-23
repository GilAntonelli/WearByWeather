import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Modal, View, Pressable, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { accessoryImages, AccessoryName } from '../constants/accessoryImages';
import { LookSuggestion } from '../types/suggestion';
import { theme } from '../styles/theme';
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
    LookAccessoryImage
} from '../styles/global';

interface Props {
    suggestion: LookSuggestion;
}

export const LookSuggestionCard: React.FC<Props> = ({ suggestion }) => {
    const { t } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.9}>
                <LookSuggestionContainer>
                    <LookRecommendation>{suggestion.recommendation}</LookRecommendation>

                    <LookAvatarContainer>
                        <LookAvatar source={suggestion.image} resizeMode="contain" />
                    </LookAvatarContainer>

                    <LookSectionTitle>{t('LookSuggestionCard.accessoryTitle')}</LookSectionTitle>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <LookAccessoryList>
                            {suggestion.acessórios?.map((accessory, index) => {
                                const icon = accessoryImages[accessory as AccessoryName];
                                return (
                                    <LookAccessoryIcon key={index}>
                                        {icon && <LookAccessoryImage source={icon} resizeMode="contain" />}
                                    </LookAccessoryIcon>
                                );
                            })}
                        </LookAccessoryList>
                    </ScrollView>

                    <LookSectionDivider />
                    <LookDescriptionText style={{ textAlign: 'center', marginBottom: 12 }}>
                        {suggestion.recommendation}
                    </LookDescriptionText>
                </LookSuggestionContainer>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 24,
                    }}
                    onPress={() => setModalVisible(false)}
                >
                    <View
                        style={{
                            width: '100%',
                            backgroundColor: theme.colors.background,
                            borderRadius: 20,
                            padding: 24,
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOpacity: 0.1,
                            shadowRadius: 10,
                            elevation: 5,
                        }}
                    >
                        <LookSectionTitle style={{ textAlign: 'center' }}>
                            {t('textLookDescription')}
                        </LookSectionTitle>

                        <LookDescriptionText style={{ textAlign: 'center', marginTop: 12 }}>
                            {suggestion.roupaSuperior}
                            {'\n'}
                            {suggestion.roupaInferior} {t('and')} {suggestion.shoes}.
                        </LookDescriptionText>

                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={{
                                marginTop: 20,
                                backgroundColor: theme.colors.primary,
                                paddingHorizontal: 24,
                                paddingVertical: 12,
                                borderRadius: 12,
                            }}
                        >
                            <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 14 }}>
                                {t('buttons.close')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
};
