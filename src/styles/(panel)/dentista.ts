import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0e12ff',
  },

  header: {
    width: '100%',
    height: 120,
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(25, 35, 200, 0.06)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },

  headerTitle: {
    color: '#eaf7ff',
    fontFamily: 'CreamCake',
    fontSize: 48,
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: 'rgba(255,255,255,0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, 
    borderColor: '#00BFFF',
  },

  scrollArea: {
    flex: 1,
  },

  verticalScroll: {
    width: '100%',
    flexGrow: 1,
  },

  screen: {
    width,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 16,
  },

  contentTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginVertical: 12,
    textAlign: 'center',
  },

  contentBox: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    padding: 16,
  },

  inputLabel: {
    color: '#cfcfcf',
    marginTop: 10,
    marginBottom: 6,
    fontWeight: '600',
  },

  input: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.35)',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },

  saveButton: {
    marginTop: 18,
    backgroundColor: '#00BFFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  navbar: {
    width: '100%',
    height: 85,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 22, 30, 0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.04)',
  },

  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  appointmentCard: {
    width: 210,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  appointmentName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  appointmentWhen: {
    fontSize: 18,
    color: '#6abcffff',
    marginTop: 10,
  },

  appointmentMeta: {
    fontSize: 16,
    color: '#ddddddff',
    marginTop: 4,
  },

  appointmentNotes: {
    fontSize: 16,
    color: '#e0d85dff',
    marginTop: 10,
    fontStyle: 'italic',
  },
});
