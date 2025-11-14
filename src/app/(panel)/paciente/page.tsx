import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { styles } from '@/styles/(panel)/paciente';
import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

type Appointment = {
  id: string;
  dentist_id: string;
  patient_first_name: string;
  patient_last_name?: string | null;
  scheduled_at?: string | null;
  date?: string | null;
  time?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  dentist_name?: string | null;
};

export default function PatientPage() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();

  const fetchAvatarForAuthUser = useCallback(async (authUser: any) => {
    if (!authUser) return null;

    try {
      let res = await supabase
        .from('users')
        .select('avatar_url')
        .eq('id', authUser.id)
        .maybeSingle();
      if (res.data?.avatar_url) return res.data.avatar_url;

      res = await supabase
        .from('users')
        .select('avatar_url')
        .eq('id_auth', authUser.id)
        .maybeSingle();
      if (res.data?.avatar_url) return res.data.avatar_url;

      if (authUser.email) {
        const email = (authUser.email || '').trim().toLowerCase();
        res = await supabase
          .from('users')
          .select('avatar_url')
          .ilike('email', email)
          .maybeSingle();
        if (res.data?.avatar_url) return res.data.avatar_url;
      }

      if (authUser.id) {
        const res2 = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id_auth', authUser.id)
          .maybeSingle();
        if (res2.data?.avatar_url) return res2.data.avatar_url;
      }
    } catch {}

    return null;
  }, []);

  const fetchAppointmentsForCurrentUser = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) {
        setAppointments([]);
        setLoading(false);
        return;
      }

      const userEmail = user.email.trim().toLowerCase();

      const { data: apptsData, error: apptsError } = await supabase
        .from('appointments')
        .select('*')
        .ilike('email', userEmail)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (apptsError) {
        setAppointments([]);
        setLoading(false);
        return;
      }

      const appts: Appointment[] = (apptsData ?? []) as Appointment[];

      if (appts.length === 0) {
        setAppointments([]);
        const avatar = await fetchAvatarForAuthUser(user);
        setAvatarUrl(avatar);
        setLoading(false);
        return;
      }

      const dentistIds = Array.from(new Set(appts.map(a => a.dentist_id).filter(Boolean)));

      let dentistsMap: Record<string, string> = {};
      if (dentistIds.length > 0) {
        const { data: dentistsData, error: dentistsError } = await supabase
          .from('users')
          .select('id, name')
          .in('id', dentistIds);

        if (!dentistsError && dentistsData?.length) {
          dentistsMap = dentistsData.reduce((acc: any, d: any) => {
            acc[d.id] = d.name ?? 'Dentista';
            return acc;
          }, {});
        } else {
          const { data: pd, error: pdErr } = await supabase
            .from('profiles')
            .select('id_auth, name')
            .in('id_auth', dentistIds);

          if (!pdErr && pd?.length) {
            dentistsMap = pd.reduce((acc: any, d: any) => {
              acc[d.id_auth] = d.name ?? 'Dentista';
              return acc;
            }, {});
          }
        }
      }

      const apptsWithDentist = appts.map(a => ({
        ...a,
        dentist_name: dentistsMap[a.dentist_id] ?? 'Dentista',
      }));

      setAppointments(apptsWithDentist);

      const avatar = await fetchAvatarForAuthUser(user);
      setAvatarUrl(avatar ?? null);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [fetchAvatarForAuthUser]);

  useEffect(() => {
    fetchAppointmentsForCurrentUser();
  }, [fetchAppointmentsForCurrentUser]);

  function formatDisplayDate(appt: Appointment) {
    if (appt.scheduled_at) {
      try {
        const d = new Date(appt.scheduled_at);
        return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
      } catch {}
    }
    if (appt.date) {
      const [y, m, d] = appt.date.split('-');
      const display = `${d}-${m}-${y}`;
      return appt.time ? `${display} ${appt.time}` : display;
    }
    return appt.time ?? '-';
  }

  function renderItem({ item }: { item: Appointment }) {
    const when = formatDisplayDate(item);
    return (
      <View style={styles.appointmentCard}>
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Text style={styles.appointmentName}>
            {item.patient_first_name} {item.patient_last_name ?? ''}
          </Text>
          <Text style={styles.appointmentWhen}>{when}</Text>

          <Text style={styles.appointmentMeta}>
            Agendado por:{" "}
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: Colors.success }}>
              {item.dentist_name ?? 'Dentista'}
            </Text>
          </Text>

          {item.notes ? <Text style={styles.appointmentNotes}>📝 {item.notes}</Text> : null}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatar} onPress={() => router.push('/(panel)/profile/page')}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={{ width: '100%', height: '100%', borderRadius: 999 }} />
          ) : (
            <Ionicons name="person" size={32} color={Colors.softWhite} />
          )}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Odontyc</Text>
      </View>

      <View style={styles.scrollArea}>
        <View style={styles.screen}>
          <Text style={styles.contentTitle}>Seus agendamentos</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#00BFFF" style={{ marginTop: 20 }} />
          ) : appointments.length === 0 ? (
            <View style={styles.contentBox}>
              <Text style={styles.contentText}>Nenhum agendamento está marcado para você.</Text>
              <Text style={styles.contentSubText}>
                Se você recebeu um agendamento, confirme com a clínica se seus dados foram preenchidos corretamente.
              </Text>
            </View>
          ) : (
            <FlatList
              data={appointments}
              keyExtractor={(it) => it.id}
              renderItem={renderItem}
              contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}