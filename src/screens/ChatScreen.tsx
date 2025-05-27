import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW_PRESETS } from '../constants';

interface ChatScreenProps {
  navigation?: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  ingredients?: string[];
}

/**
 * ChatScreen Component
 * 
 * Modern chat interface for ingredient-based recipe search
 * Users can input ingredients they have and get recipe suggestions
 */
const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Merhaba! 👋 Elinizdeki malzemeleri söyleyin, size harika tarifler önereyim!',
      isUser: false,
      timestamp: new Date(),
    },
    {
      id: '2',
      text: 'Örneğin: "Elimde domates, soğan ve tavuk var" diyebilirsiniz.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const flatListRef = useRef<FlatList>(null);

  // Auto scroll to bottom when new message added
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = useCallback(() => {
    if (inputText.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isUser: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setInputText('');

      // Simulate AI response
      setTimeout(() => {
        const ingredients = extractIngredients(inputText);
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: generateBotResponse(ingredients),
          isUser: false,
          timestamp: new Date(),
          ingredients,
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  }, [inputText]);

  // Extract ingredients from user message (simple implementation)
  const extractIngredients = useCallback((text: string): string[] => {
    const commonIngredients = [
      'domates', 'soğan', 'tavuk', 'et', 'balık', 'yumurta', 'süt', 'peynir',
      'patates', 'havuç', 'biber', 'salatalık', 'marul', 'makarna', 'pirinç',
      'un', 'şeker', 'tuz', 'karabiber', 'zeytinyağı', 'tereyağı', 'sarımsak',
      'limon', 'domates', 'fasulye', 'nohut', 'mercimek', 'bulgur'
    ];
    
    const foundIngredients = commonIngredients.filter(ingredient =>
      text.toLowerCase().includes(ingredient)
    );
    
    return foundIngredients.length > 0 ? foundIngredients : ['genel malzemeler'];
  }, []);

  // Generate bot response based on ingredients
  const generateBotResponse = useCallback((ingredients: string[]): string => {
    if (ingredients.includes('genel malzemeler')) {
      return 'Hangi malzemelerin olduğunu daha detaylı söyleyebilir misiniz? Böylece size daha uygun tarifler önerebilirim! 🍳';
    }

    const responses = [
      `Harika! ${ingredients.join(', ')} ile yapabileceğiniz ${Math.floor(Math.random() * 10) + 5} farklı tarif buldum! 🎉`,
      `${ingredients.join(', ')} malzemeleriyle enfes yemekler yapabilirsiniz! Size özel tarifler hazırlıyorum... ✨`,
      `Mükemmel kombinasyon! ${ingredients.join(', ')} ile hem kolay hem lezzetli tarifler var. 👨‍🍳`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }, []);

  const renderMessage = useCallback(({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.botMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.botBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isUser ? styles.userText : styles.botText
        ]}>
          {item.text}
        </Text>
        
        {/* Show ingredients as chips for bot messages */}
        {!item.isUser && item.ingredients && item.ingredients.length > 0 && (
          <View style={styles.ingredientsContainer}>
            {item.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientChip}>
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      
      <Text style={[
        styles.timestamp,
        item.isUser ? styles.userTimestamp : styles.botTimestamp
      ]}>
        {item.timestamp.toLocaleTimeString('tr-TR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </Text>
    </View>
  ), []);

  const renderSuggestions = useCallback(() => (
    <View style={styles.suggestionsContainer}>
      <Text style={styles.suggestionsTitle}>Hızlı başlangıç örnekleri:</Text>
      <View style={styles.suggestionChips}>
        {[
          'Elimde tavuk ve sebze var',
          'Makarna yapacağım',
          'Kahvaltı hazırlamak istiyorum',
          'Tatlı yapmak istiyorum'
        ].map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionChip}
            onPress={() => setInputText(suggestion)}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  ), []);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>MyCheff AI</Text>
          <Text style={styles.headerSubtitle}>Malzeme bazlı tarif asistanı</Text>
        </View>
        
        <View style={styles.aiIndicator}>
          <View style={styles.aiDot} />
          <Text style={styles.aiText}>AI</Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={messages.length <= 2 ? renderSuggestions : null}
        />

        {/* Input Area */}
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + SPACING.md }]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Elinizdeki malzemeleri yazın..."
              placeholderTextColor={COLORS.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity
              style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={inputText.trim() ? COLORS.white : COLORS.textMuted} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.CIRCLE,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.ROUND,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    gap: SPACING.xs,
  },
  aiDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.white,
  },
  aiText: {
    fontSize: FONT_SIZE.XS,
    fontWeight: '600',
    color: COLORS.white,
  },
  content: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  messageContainer: {
    marginBottom: SPACING.lg,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  botMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: BORDER_RADIUS.LG,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
  },
  botBubble: {
    backgroundColor: COLORS.white,
    ...SHADOW_PRESETS.SMALL,
  },
  messageText: {
    fontSize: FONT_SIZE.MD,
    lineHeight: 20,
  },
  userText: {
    color: COLORS.white,
  },
  botText: {
    color: COLORS.textPrimary,
  },
  timestamp: {
    fontSize: FONT_SIZE.XS,
    marginTop: SPACING.xs,
  },
  userTimestamp: {
    color: COLORS.textMuted,
    textAlign: 'right',
  },
  botTimestamp: {
    color: COLORS.textMuted,
    textAlign: 'left',
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
  ingredientChip: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.SM,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  ingredientText: {
    fontSize: FONT_SIZE.XS,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  suggestionsContainer: {
    marginTop: SPACING.xl,
    paddingTop: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  suggestionsTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  suggestionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  suggestionChip: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW_PRESETS.SMALL,
  },
  suggestionText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.LG,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  textInput: {
    flex: 1,
    fontSize: FONT_SIZE.MD,
    color: COLORS.textPrimary,
    maxHeight: 100,
    paddingVertical: SPACING.xs,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.CIRCLE,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: COLORS.primary,
  },
});

export default React.memo(ChatScreen); 