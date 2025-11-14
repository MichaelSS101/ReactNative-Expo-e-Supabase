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
    width: '94%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    padding: 16,
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  contentText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  contentSubText: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },

  navbar: {
    width: '100%',
    height: 85,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(25, 35, 200, 0.06)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.04)',
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },

  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  appointmentCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
  },

  appointmentName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  appointmentWhen: {
    fontSize: 16,
    color: '#6abcff',
    marginTop: 8,
    fontWeight: '600',
  },

  appointmentMeta: {
    fontSize: 15,
    color: '#ddddddff',
    marginTop: 6,
  },

  appointmentNotes: {
    fontSize: 15,
    color: '#e0d85dff',
    marginTop: 10,
    fontStyle: 'italic',
  },
});
