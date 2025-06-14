import React, { createContext, useContext, useRef, useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';

interface ModalContextType {
  openModal: (component: React.ReactNode, snapPoints?: string[]) => void;
  closeModal: () => void;
  isOpen: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [snapPoints, setSnapPoints] = useState<string[]>(['50%', '90%']);
  const [isOpen, setIsOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const openModal = useCallback((component: React.ReactNode, customSnapPoints?: string[]) => {
    setModalContent(component);
    if (customSnapPoints) {
      setSnapPoints(customSnapPoints);
    }
    setIsOpen(true);
    bottomSheetRef.current?.expand();
  }, []);

  const closeModal = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsOpen(false);
      setModalContent(null);
    }
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        handleIndicatorStyle={styles.indicator}
        backgroundStyle={styles.background}
        style={styles.bottomSheet}
      >
        <BottomSheetView style={[styles.contentContainer, { paddingBottom: insets.bottom }]}>
          {modalContent}
        </BottomSheetView>
      </BottomSheet>
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  background: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  indicator: {
    backgroundColor: '#E5E5E5',
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
}); 