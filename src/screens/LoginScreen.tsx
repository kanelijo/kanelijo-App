import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../services/supabase';
import { Ionicons } from '@expo/vector-icons';
import { notifyServer } from '../utils/notifyServer';
import ScreenBackground from '../components/ScreenBackground';

type Step = 'form' | 'otp' | 'forgot' | 'forgotSent';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [role, setRole] = useState<'student' | 'owner'>('student');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<Step>('form');

  // ── Email / Password Auth ──
  const handleAuthentication = async () => {
    if (!email || !password) { Alert.alert('Missing fields', 'Please enter your email and password.'); return; }
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role } }
      });
      if (error) { Alert.alert('Sign Up Error', error.message); }
      else { setStep('otp'); }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { Alert.alert('Sign In Error', error.message); }
    }
    setLoading(false);
  };

  // ── OTP Verification ──
  const handleVerifyOtp = async () => {
    if (!otpCode) return;
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({ email, token: otpCode, type: 'signup' });

    if (error) {
      Alert.alert('Verification Failed', error.message);
    } else {
      // ✅ Send welcome email after verified signup
      const name = data.user?.user_metadata?.full_name || email.split('@')[0];
      notifyServer({ type: 'welcome', email, name });
      Alert.alert('Welcome to Kanelijo! 🎉', 'Your account has been verified.');
    }
    setLoading(false);
  };

  // ── Forgot Password ──
  const handleForgotPassword = async () => {
    if (!forgotEmail) { Alert.alert('Enter your email', 'Please enter your registered email address.'); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: 'https://team.kanelijo.com/reset-password',
    });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setStep('forgotSent');
    }
    setLoading(false);
  };

  return (
    <ScreenBackground>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} enabled={Platform.OS !== 'web'} style={styles.container}>

        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="home" size={40} color="#E83A30" />
          </View>
          <Text style={styles.title}>Kanelijo</Text>
          <Text style={styles.subtitle}>Premium Room Discovery for Students</Text>
        </View>

        <View style={styles.formCard}>

          {/* ── SIGN IN / SIGN UP FORM ── */}
          {step === 'form' && (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#a1a1aa" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#71717a"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#a1a1aa" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#71717a"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>

              {/* Forgot Password link */}
              {!isSignUp && (
                <TouchableOpacity style={styles.forgotLink} onPress={() => { setForgotEmail(email); setStep('forgot'); }}>
                  <Text style={styles.forgotLinkText}>Forgot password?</Text>
                </TouchableOpacity>
              )}

              {isSignUp && (
                <View style={styles.roleContainer}>
                  <Text style={styles.roleLabel}>I am a:</Text>
                  <View style={styles.roleSelector}>
                    <TouchableOpacity style={[styles.roleOption, role === 'student' && styles.roleOptionActive]} onPress={() => setRole('student')}>
                      <Ionicons name="school" size={20} color={role === 'student' ? '#fff' : '#a1a1aa'} />
                      <Text style={[styles.roleText, role === 'student' && styles.roleTextActive]}>Student</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.roleOption, role === 'owner' && styles.roleOptionActive]} onPress={() => setRole('owner')}>
                      <Ionicons name="business" size={20} color={role === 'owner' ? '#fff' : '#a1a1aa'} />
                      <Text style={[styles.roleText, role === 'owner' && styles.roleTextActive]}>Owner</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <TouchableOpacity style={styles.actionButtonContainer} disabled={loading} onPress={handleAuthentication}>
                <LinearGradient colors={['#E83A30', '#F0994E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.switchModeButton} onPress={() => setIsSignUp(!isSignUp)} disabled={loading}>
                <Text style={styles.switchModeText}>
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* ── OTP VERIFY STEP ── */}
          {step === 'otp' && (
            <>
              <View style={styles.centeredHeader}>
                <View style={styles.stepIconCircle}>
                  <Ionicons name="mail-open-outline" size={32} color="#E83A30" />
                </View>
                <Text style={styles.stepTitle}>Verify your email</Text>
                <Text style={styles.stepSubtitle}>We sent a verification code to{'\n'}<Text style={styles.emailHighlight}>{email}</Text></Text>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="keypad-outline" size={20} color="#a1a1aa" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter OTP code"
                  placeholderTextColor="#71717a"
                  value={otpCode}
                  onChangeText={setOtpCode}
                  keyboardType="number-pad"
                  maxLength={8}
                  editable={!loading}
                />
              </View>

              <TouchableOpacity style={styles.actionButtonContainer} disabled={loading || otpCode.length < 6} onPress={handleVerifyOtp}>
                <LinearGradient colors={['#10b981', '#059669']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify & Continue</Text>}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.switchModeButton} onPress={() => setStep('form')} disabled={loading}>
                <Text style={styles.switchModeText}>← Back to Sign In</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ── FORGOT PASSWORD STEP ── */}
          {step === 'forgot' && (
            <>
              <View style={styles.centeredHeader}>
                <View style={styles.stepIconCircle}>
                  <Ionicons name="lock-open-outline" size={32} color="#E83A30" />
                </View>
                <Text style={styles.stepTitle}>Reset Password</Text>
                <Text style={styles.stepSubtitle}>Enter your email to receive a password reset link</Text>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#a1a1aa" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Your email address"
                  placeholderTextColor="#71717a"
                  value={forgotEmail}
                  onChangeText={setForgotEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!loading}
                />
              </View>

              <TouchableOpacity style={styles.actionButtonContainer} disabled={loading} onPress={handleForgotPassword}>
                <LinearGradient colors={['#E83A30', '#F0994E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send Reset Link</Text>}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.switchModeButton} onPress={() => setStep('form')} disabled={loading}>
                <Text style={styles.switchModeText}>← Back to Sign In</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ── FORGOT PASSWORD SENT ── */}
          {step === 'forgotSent' && (
            <View style={styles.successState}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={56} color="#10b981" />
              </View>
              <Text style={styles.stepTitle}>Check your inbox!</Text>
              <Text style={styles.stepSubtitle}>
                We sent a password reset link to{'\n'}<Text style={styles.emailHighlight}>{forgotEmail}</Text>{'\n\n'}Open the link on your phone or browser to set a new password.
              </Text>
              <TouchableOpacity style={styles.switchModeButton} onPress={() => setStep('form')}>
                <Text style={styles.switchModeText}>← Back to Sign In</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  title: { fontSize: 36, fontWeight: '800', color: '#111827', letterSpacing: 1 },
  subtitle: { fontSize: 14, color: '#6b7280', marginTop: 8 },
  formCard: { backgroundColor: '#ffffff', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 15, elevation: 4 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 16, height: 56 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#111827', fontSize: 16, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) },
  forgotLink: { alignSelf: 'flex-end', marginBottom: 16, marginTop: -4 },
  forgotLinkText: { color: '#E83A30', fontSize: 13, fontWeight: '600' },
  roleContainer: { marginBottom: 20, marginTop: 4 },
  roleLabel: { color: '#6b7280', fontSize: 14, marginBottom: 8, fontWeight: '500' },
  roleSelector: { flexDirection: 'row', gap: 12 },
  roleOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#f9fafb', paddingVertical: 14, borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  roleOptionActive: { backgroundColor: '#E83A30', borderColor: '#E83A30' },
  roleText: { color: '#6b7280', fontSize: 14, fontWeight: '600' },
  roleTextActive: { color: '#ffffff' },
  actionButtonContainer: { marginTop: 8, borderRadius: 16, overflow: 'hidden' },
  gradientButton: { height: 56, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  switchModeButton: { marginTop: 20, alignItems: 'center' },
  switchModeText: { color: '#6b7280', fontSize: 14, fontWeight: '500' },
  centeredHeader: { alignItems: 'center', marginBottom: 24 },
  stepIconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#fff5f5', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#fecaca' },
  stepTitle: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 8, textAlign: 'center' },
  stepSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 22 },
  emailHighlight: { color: '#E83A30', fontWeight: '700' },
  successState: { alignItems: 'center', paddingVertical: 16 },
  successIcon: { marginBottom: 16 },
});
