import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants';

interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  category?: string;
  aliases?: string[];
}

interface Props {
  navigation?: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

const INGREDIENTS_DATA: Ingredient[] = [
  { id: '1', name: 'Tomato', emoji: '🍅', category: 'vegetables', aliases: ['tomatoes'] },
  { id: '2', name: 'Garlic', emoji: '🧄', category: 'vegetables', aliases: ['garlic clove'] },
  { id: '3', name: 'Onion', emoji: '🧅', category: 'vegetables', aliases: ['onions'] },
  { id: '4', name: 'Bread', emoji: '🥖', category: 'grains', aliases: ['baguette'] },
  { id: '5', name: 'Chicken', emoji: '🍗', category: 'proteins', aliases: ['chicken breast', 'poultry'] },
  { id: '6', name: 'Carrot', emoji: '🥕', category: 'vegetables', aliases: ['carrots'] },
  { id: '7', name: 'Cucumber', emoji: '🥒', category: 'vegetables', aliases: ['cucumbers'] },
  { id: '8', name: 'Chili', emoji: '🌶️', category: 'spices', aliases: ['chili pepper', 'hot pepper'] },
  { id: '9', name: 'Potato', emoji: '🥔', category: 'vegetables', aliases: ['potatoes'] },
  { id: '10', name: 'Cheese', emoji: '🧀', category: 'dairy', aliases: ['cheddar', 'mozzarella'] },
  { id: '11', name: 'Egg', emoji: '🥚', category: 'proteins', aliases: ['eggs'] },
  { id: '12', name: 'Rice', emoji: '🍚', category: 'grains', aliases: ['white rice', 'brown rice'] },
  { id: '13', name: 'Pasta', emoji: '🍝', category: 'grains', aliases: ['spaghetti', 'noodles'] },
  { id: '14', name: 'Bell Pepper', emoji: '🫑', category: 'vegetables', aliases: ['pepper', 'capsicum'] },
  { id: '15', name: 'Mushroom', emoji: '🍄', category: 'vegetables', aliases: ['mushrooms'] },
  { id: '16', name: 'Spinach', emoji: '🥬', category: 'vegetables', aliases: ['leafy greens'] },
  { id: '17', name: 'Beef', emoji: '🥩', category: 'proteins', aliases: ['steak', 'ground beef'] },
  { id: '18', name: 'Fish', emoji: '🐟', category: 'proteins', aliases: ['salmon', 'tuna'] },
  { id: '19', name: 'Milk', emoji: '🥛', category: 'dairy', aliases: ['whole milk'] },
  { id: '20', name: 'Butter', emoji: '🧈', category: 'dairy', aliases: ['unsalted butter'] },
];

const ChatScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const [inputText, setInputText] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [suggestions, setSuggestions] = useState<Ingredient[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputText.length >= 2) {
        const filtered = INGREDIENTS_DATA.filter(ingredient => {
          const isAlreadySelected = selectedIngredients.some(selected => selected.id === ingredient.id);
          if (isAlreadySelected) return false;

          const searchTerm = inputText.toLowerCase();
          const nameMatch = ingredient.name.toLowerCase().includes(searchTerm);
          const aliasMatch = ingredient.aliases?.some(alias => 
            alias.toLowerCase().includes(searchTerm)
          );
          
          return nameMatch || aliasMatch;
        }).slice(0, 5);

        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
        
        if (filtered.length > 0) {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      } else {
        setShowSuggestions(false);
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputText, selectedIngredients, fadeAnim]);

  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredients(prev => [...prev, ingredient]);
    setInputText('');
    setShowSuggestions(false);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
    
    // Keep focus on input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleRemoveIngredient = (id: string) => {
    setSelectedIngredients(prev => prev.filter(item => item.id !== id));
  };

  const handleSend = () => {
    if (selectedIngredients.length > 0) {
      navigation?.navigate('Home', { 
        selectedIngredients: selectedIngredients.map(i => i.name)
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>What's in your kitchen?</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Chat Area */}
        <ScrollView style={styles.chatArea} showsVerticalScrollIndicator={false}>
          {/* Selected Ingredients */}
          {selectedIngredients.length > 0 && (
            <View style={styles.selectedSection}>
              <Text style={styles.selectedTitle}>Selected Ingredients:</Text>
              <View style={styles.chipsContainer}>
                {selectedIngredients.map((ingredient) => (
                  <Animated.View
                    key={ingredient.id}
                    style={[
                      styles.chip,
                      {
                        transform: [{
                          scale: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1],
                          })
                        }]
                      }
                    ]}
                  >
                    <Text style={styles.chipEmoji}>{ingredient.emoji}</Text>
                    <Text style={styles.chipText}>{ingredient.name}</Text>
                    <TouchableOpacity 
                      onPress={() => handleRemoveIngredient(ingredient.id)}
                      style={styles.chipRemove}
                    >
                      <Ionicons name="close" size={16} color={COLORS.white} />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </View>
          )}

          {/* Suggestions Overlay */}
          {showSuggestions && (
            <Animated.View 
              style={[
                styles.suggestionsOverlay,
                {
                  opacity: fadeAnim,
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    })
                  }]
                }
              ]}
            >
              <Text style={styles.suggestionsTitle}>Suggestions</Text>
              <FlatList
                data={suggestions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.suggestionItem}
                    onPress={() => handleSelectIngredient(item)}
                  >
                    <Text style={styles.suggestionEmoji}>{item.emoji}</Text>
                    <Text style={styles.suggestionText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                scrollEnabled={false}
              />
            </Animated.View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={[styles.inputArea, { paddingBottom: insets.bottom }]}>
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.textInput}
              placeholder="Type ingredient..."
              placeholderTextColor={COLORS.textMuted}
              value={inputText}
              onChangeText={setInputText}
              autoCapitalize="words"
              autoCorrect={false}
              blurOnSubmit={false}
            />
            {selectedIngredients.length > 0 && (
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleSend}
              >
                <Ionicons name="send" size={20} color={COLORS.white} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  selectedSection: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: SPACING.sm,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: BORDER_RADIUS.ROUND,
    paddingVertical: SPACING.sm,
    paddingLeft: SPACING.md,
    paddingRight: SPACING.xs,
    gap: SPACING.xs,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  chipEmoji: {
    fontSize: 16,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.white,
  },
  chipRemove: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.xs,
  },
  suggestionsOverlay: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.md,
    marginVertical: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: SPACING.sm,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    borderRadius: BORDER_RADIUS.MD,
    gap: SPACING.sm,
  },
  suggestionEmoji: {
    fontSize: 18,
  },
  suggestionText: {
    fontSize: 15,
    color: '#1C1C1E',
  },
  inputArea: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: BORDER_RADIUS.ROUND,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    paddingVertical: SPACING.md,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: BORDER_RADIUS.ROUND,
    padding: SPACING.sm,
  },
});

export default ChatScreen; 