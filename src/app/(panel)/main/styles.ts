import { StyleSheet} from 'react-native';
import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  /* HEADER */
  header: {
    height: 80,
    paddingTop: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },

  /* CONTENT */
  contentWrap: {
    flex: 1,
  },
  principalBox: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
    justifyContent: 'space-between',
  },
  contentTitle: {
    color: '#fff',
    fontSize: 72,
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 4,
  },
  content: {
    height: '60%',
    margin: 15,
    top: 55,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  contentText: {
    color: '#fff',
    fontSize: 18,
    paddingTop: 10,
    textAlign: 'center',
  },

  /* FOOTER */
  footer: {
    width: '100%',
    height: '16%',
    top: 45,
    borderTopWidth: 2,
    borderColor: '#1c1d1fff',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 70,
    backgroundColor: '#222324ff',

  },
  navButton: {
    width: 56,
    height: 56,
    paddingTop: 25,
    alignItems: 'center',
    justifyContent: 'flex-end',
    elevation: 3,
  },
  navButtonLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 2,
  },
});