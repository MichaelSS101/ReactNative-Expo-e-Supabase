import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/colors';
import { styles } from '@/styles/(panel)/dentista';

const { width } = Dimensions.get('window');
const NAVBAR_HEIGHT = 85;

export default function DentistPage() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView | null>(null);
  const [activeTab, setActiveTab] = useState<'agendar' | 'lista'>('agendar');

  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(true);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  useEffect(() => {
    (async () => {
      setAvatarLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ?? null);

      if (user) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('avatar_url')
            .eq('id', user.id)
            .single();
          if (!error) setAvatarUrl(data?.avatar_url ?? null);
        } catch (err) {
          console.error(err);
        } finally {
          setAvatarLoading(false);
        }

        fetchAppointments(user.id);
      } else {
        setAvatarLoading(false);
      }
    })();
  }, []);

  const handleOpenProfile = () => router.push('/(panel)/profile/page');
  const goAgendar = () => { scrollRef.current?.scrollTo({ x: 0, animated: true }); setActiveTab('agendar'); };
  const goLista = () => { scrollRef.current?.scrollTo({ x: width, animated: true }); setActiveTab('lista'); };

  const handleScrollEnd = (event: any) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(xOffset / width);
    setActiveTab(index === 0 ? 'agendar' : 'lista');
    if (index === 1 && user) fetchAppointments(user.id);
  };

  async function fetchAppointments(dentistId: string) {
    try {
      setLoadingList(true);
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('dentist_id', dentistId)
        .order('date', { ascending: true })
        .order('scheduled_at', { ascending: true });
      if (error) throw error;
      setAppointments(data ?? []);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível buscar agendamentos.');
    } finally {
      setLoadingList(false);
    }
  }

  function formatDateInput(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return digits.slice(0, 2) + '-' + digits.slice(2);
    return digits.slice(0, 2) + '-' + digits.slice(2, 4) + '-' + digits.slice(4);
  }

  function formatTimeInput(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return digits.slice(0, 2) + ':' + digits.slice(2);
  }

  function formatPhoneInput(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 11);
    if (digits.length === 0) return '';
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  function isValidDateDDMMYYYY(v: string) {
    if (!/^\d{2}-\d{2}-\d{4}$/.test(v)) return false;
    const [dd, mm, yyyy] = v.split('-').map(Number);
    const d = new Date(yyyy, mm - 1, dd);
    return d.getFullYear() === yyyy && d.getMonth() === mm - 1 && d.getDate() === dd;
  }

  function isValidTimeHHMM(v: string) {
    if (!/^\d{2}:\d{2}$/.test(v)) return false;
    const [hh, mm] = v.split(':').map(Number);
    return hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59;
  }

  function buildScheduledAtISO(dateDDMMYYYY?: string, timeHHMM?: string) {
    if (!dateDDMMYYYY) return null;
    const [dd, mm, yyyy] = dateDDMMYYYY.split('-');
    if (!dd || !mm || !yyyy) return null;
    const yyyyMmDd = `${yyyy}-${mm}-${dd}`;
    const timePart = isValidTimeHHMM(timeHHMM ?? '') ? timeHHMM : '00:00';
    return new Date(`${yyyyMmDd}T${timePart}:00`).toISOString();
  }

  function validateForm() {

    if (!firstName.trim()) { Alert.alert('Validação', 'Preencha o Nome do paciente.'); return false; }
    if (!lastName.trim()) { Alert.alert('Validação', 'Preencha o Sobrenome do paciente.'); return false; }
    if (!date.trim()) { Alert.alert('Validação', 'Preencha a Data do agendamento.'); return false; }
    if (!time.trim()) { Alert.alert('Validação', 'Preencha o Horário do agendamento.'); return false; }
    if (!phone.trim()) { Alert.alert('Validação', 'Preencha o Telefone do paciente.'); return false; }
    if (!email.trim()) { Alert.alert('Validação', 'Preencha o Email do paciente.'); return false; }

    if (!isValidDateDDMMYYYY(date)) { Alert.alert('Validação', 'Data inválida. Use o formato DD-MM-YYYY.'); return false; }
    if (!isValidTimeHHMM(time)) { Alert.alert('Validação', 'Horário inválido. Use o formato HH:MM.'); return false; }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) { Alert.alert('Validação', 'O formato do Email está inválido.'); return false; }

    return true;
  }

  async function checkPatientEmail(emailToCheck: string, dentistId: string): Promise<{ success: boolean; message: string }> {
    const trimmedEmail = emailToCheck.trim().toLowerCase(); 

    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('id, permissao')
      .eq('email', trimmedEmail)
      .single();

    if (fetchError) {
        console.error("Supabase Error (Check Email):", fetchError.message);
        
        const errorMessage = fetchError.message.includes('permission denied') || fetchError.code === '42501'
            ? 'Erro de Permissão (RLS): Verifique se a RLS (Row-Level Security) da tabela "users" permite a leitura pelo dentista.'
            : 'O email inserido não está cadastrado no sistema Odontyc ou houve um erro de conexão.';
            
      return { success: false, message: errorMessage };
    }
    
    if (!userData) {
        return { success: false, message: 'O email inserido não está cadastrado no sistema Odontyc.' };
    }

    if (userData.id === dentistId) {
      return { success: false, message: 'O email inserido pertence a você. Use o email de um paciente cadastrado.' };
    }
    
    if (userData.permissao === 'dentista') {
        return { success: false, message: 'O usuário com este email é outro dentista, não um paciente.' };
    }

    return { success: true, message: '' };
  }

  async function handleSaveAppointment() {
    if (!user) { Alert.alert('Erro', 'Usuário não autenticado.'); return; }
    
    if (!validateForm()) return; 

    setSaving(true);
    try {
      
      const emailValidation = await checkPatientEmail(email, user.id);
      if (!emailValidation.success) {
        Alert.alert('Validação de Email', emailValidation.message);
        setSaving(false); 
        return; 
      }

      const scheduled_at = buildScheduledAtISO(date || undefined, time || undefined);
      const insertObj: any = {
        dentist_id: user.id,
        patient_first_name: firstName.trim(),
        patient_last_name: lastName.trim(),
        scheduled_at,
        date: date ? date.split('-').reverse().join('-') : null,
        time: time || null,
        phone: phone.replace(/\D/g, ''),
        email: email.trim().toLowerCase(),
        notes: notes || null,
      };

      const { error } = await supabase.from('appointments').insert(insertObj);
      if (error) throw error;

      Alert.alert('Sucesso', 'Agendamento salvo com sucesso!');
      setFirstName(''); setLastName(''); setDate(''); setTime(''); setPhone(''); setEmail(''); setNotes('');
      fetchAppointments(user.id);
      goLista();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível salvar o agendamento.');
    } finally { setSaving(false); }
  }

  const renderAppointment = ({ item }: { item: any }) => {
    const when = item.scheduled_at
      ? new Date(item.scheduled_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
      : `${item.date ? item.date.split('-').reverse().join('-') : '-'} ${item.time ?? ''}`;
    return (
      <View style={styles.appointmentCard}>
        <Text style={styles.appointmentName}>{item.patient_first_name} {item.patient_last_name ?? ''}</Text>
        <Text style={styles.appointmentWhen}>{when}</Text>
        {item.phone && <Text style={styles.appointmentMeta}>📞 {item.phone}</Text>}
        {item.email && <Text style={styles.appointmentMeta}>✉️ {item.email}</Text>}
        {item.notes && <Text style={styles.appointmentNotes}>📝 {item.notes}</Text>}
      </View>
    );
  };

  function openDatePicker() { setShowDatePicker(true); }
  function openTimePicker() { setShowTimePicker(true); }
  function onDatePickerChange(event: any, selected?: Date) {
    setShowDatePicker(Platform.OS === 'ios');
    if (selected) {
      const dd = String(selected.getDate()).padStart(2, '0');
      const mm = String(selected.getMonth() + 1).padStart(2, '0');
      const yyyy = String(selected.getFullYear());
      setDate(`${dd}-${mm}-${yyyy}`);
    }
  }
  function onTimePickerChange(event: any, selected?: Date) {
    setShowTimePicker(Platform.OS === 'ios');
    if (selected) {
      const hh = String(selected.getHours()).padStart(2, '0');
      const mm = String(selected.getMinutes()).padStart(2, '0');
      setTime(`${hh}:${mm}`);
    }
  }

  const headerAnim = useRef(new Animated.Value(1)).current;
  const footerAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, {
        toValue: 1.02,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(footerAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      <Animated.View style={[styles.header, { transform: [{ scale: headerAnim }] }]}>
        <TouchableOpacity style={styles.avatar} onPress={handleOpenProfile} activeOpacity={0.7}>
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 999,
              }}
            />
          ) : (
            <Ionicons name="person" size={32} color={Colors.softWhite} />
          )}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Odontyc</Text>
      </Animated.View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        onMomentumScrollEnd={handleScrollEnd}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollArea}
      >
        <View style={styles.screen}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ width, flex: 1 }}>
            <ScrollView 
                contentContainerStyle={{ padding: 16, paddingBottom: NAVBAR_HEIGHT + 24 }}
                showsVerticalScrollIndicator={false}
            >
              <Text style={styles.contentTitle}>Agendar consulta</Text>
              <View style={styles.contentBox}>

                <Text style={styles.inputLabel}>Nome</Text>
                <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="Nome do paciente" placeholderTextColor="#999" />

                <Text style={styles.inputLabel}>Sobrenome</Text>
                <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Sobrenome" placeholderTextColor="#999" />

                <Text style={styles.inputLabel}>Data</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={date}
                    onChangeText={(t) => setDate(formatDateInput(t))}
                    placeholder="02-12-2025"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    maxLength={10}
                  />
                  <TouchableOpacity onPress={openDatePicker} style={{ padding: 10 }}>
                    <Ionicons name="calendar" size={22} color={Colors.softWhite} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>Horário</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={time}
                    onChangeText={(t) => setTime(formatTimeInput(t))}
                    placeholder="14:30"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    maxLength={5}
                  />
                  <TouchableOpacity onPress={openTimePicker} style={{ padding: 10 }}>
                    <Ionicons name="time" size={22} color={Colors.softWhite} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={(t) => setPhone(formatPhoneInput(t))}
                  placeholder="(99) 99999-9999"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  maxLength={15}
                />

                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="contato@exemplo.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={styles.inputLabel}>Observação (Opcional)</Text>
                <TextInput style={[styles.input, { height: 100 }]} value={notes} onChangeText={setNotes} placeholder="Observações..." placeholderTextColor="#999" multiline />

                <TouchableOpacity style={styles.saveButton} onPress={handleSaveAppointment} disabled={saving}>
                  {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Salvar agendamento</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>

        <View style={styles.screen}>
          <Text style={[styles.contentTitle, { paddingHorizontal: 16, paddingTop: 10 }]}>Meus agendamentos</Text>

          {loadingList ? (
            <ActivityIndicator size="large" color="#00BFFF" style={{ marginTop: 20 }} />
          ) : appointments.length === 0 ? (
            <Text style={{ color: '#ccc', marginTop: 12, paddingHorizontal: 16 }}>Nenhum agendamento encontrado.</Text>
          ) : (
            <FlatList
              data={appointments}
              keyExtractor={(it) => it.id}
              renderItem={renderAppointment}
              contentContainerStyle={{ padding: 16, paddingBottom: NAVBAR_HEIGHT + 24 }}
              nestedScrollEnabled
            />
          )}
        </View>
      </ScrollView>

      {showDatePicker && <DateTimePicker value={new Date()} mode="date" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={onDatePickerChange} />}
      {showTimePicker && <DateTimePicker value={new Date()} mode="time" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onTimePickerChange} />}

      <View style={styles.navbar}>
        <TouchableOpacity onPress={goAgendar} style={styles.navButton}>
          <Ionicons name="clipboard-sharp" size={28} color={activeTab === 'agendar' ? '#00BFFF' : '#fff'} />
          <Text style={{ color: activeTab === 'agendar' ? '#00BFFF' : '#fff', marginTop: 4 }}>Agendar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goLista} style={styles.navButton}>
          <Ionicons name="list" size={28} color={activeTab === 'lista' ? '#00BFFF' : '#fff'} />
          <Text style={{ color: activeTab === 'lista' ? '#00BFFF' : '#fff', marginTop: 4 }}>Lista</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}