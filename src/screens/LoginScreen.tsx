import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../services/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [role, setRole] = useState<'student' | 'owner'>('student');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<'form' | 'otp'>('form');

  const handleAuthentication = async () => {
    if (!email || !password) return;
    setLoading(true);
    
    if (isSignUp) {
      // Create user with metadata for role
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { role: role }
        }
      });
      if (error) {
        alert(error.message);
      } else {
        // Move to OTP verification step
        setStep('otp');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otpCode) return;
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: 'signup'
    });
    
    if (error) {
      alert(error.message);
    } else {
      alert('Verification successful! You are now logged in.');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} enabled={Platform.OS !== 'web'} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="home" size={40} color="#E83A30" />
        </View>
        <Text style={styles.title}>Kanelijo</Text>
        <Text style={styles.subtitle}>Premium Room Discovery for Students</Text>
      </View>

      <View style={styles.formCard}>
        {step === 'form' ? (
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
                cursorColor="#111827"
                selectionColor="#E83A30"
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
                cursorColor="#111827"
                selectionColor="#E83A30"
              />
            </View>

            {isSignUp && (
              <View style={styles.roleContainer}>
                <Text style={styles.roleLabel}>I am a:</Text>
                <View style={styles.roleSelector}>
                  <TouchableOpacity 
                    style={[styles.roleOption, role === 'student' && styles.roleOptionActive]}
                    onPress={() => setRole('student')}
                  >
                    <Ionicons name="school" size={20} color={role === 'student' ? '#fff' : '#a1a1aa'} />
                    <Text style={[styles.roleText, role === 'student' && styles.roleTextActive]}>Student</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.roleOption, role === 'owner' && styles.roleOptionActive]}
                    onPress={() => setRole('owner')}
                  >
                    <Ionicons name="business" size={20} color={role === 'owner' ? '#fff' : '#a1a1aa'} />
                    <Text style={[styles.roleText, role === 'owner' && styles.roleTextActive]}>Owner</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity 
              style={styles.actionButtonContainer} 
              disabled={loading} 
              onPress={handleAuthentication}
            >
              <LinearGradient
                colors={['#E83A30', '#F0994E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.switchModeButton} 
              onPress={() => setIsSignUp(!isSignUp)}
              disabled={loading}
            >
              <Text style={styles.switchModeText}>
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.otpHeader}>
              <Text style={styles.otpTitle}>Verify your email</Text>
              <Text style={styles.otpSubtitle}>We sent an 8-digit code to {email}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="keypad-outline" size={20} color="#a1a1aa" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter 8-digit OTP code"
                placeholderTextColor="#71717a"
                value={otpCode}
                onChangeText={setOtpCode}
                keyboardType="number-pad"
                maxLength={8}
                editable={!loading}
                cursorColor="#111827"
                selectionColor="#E83A30"
              />
            </View>

            <TouchableOpacity 
              style={styles.actionButtonContainer} 
              disabled={loading || otpCode.length < 8} 
              onPress={handleVerifyOtp}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Verify Code</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.switchModeButton} 
              onPress={() => setStep('form')}
              disabled={loading}
            >
              <Text style={styles.switchModeText}>Back to Sign In</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  formCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#111827',
    fontSize: 16,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  roleContainer: {
    marginBottom: 20,
    marginTop: 4,
  },
  roleLabel: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f9fafb',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  roleOptionActive: {
    backgroundColor: '#E83A30',
    borderColor: '#E83A30',
  },
  roleText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
  },
  roleTextActive: {
    color: '#ffffff',
  },
  actionButtonContainer: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientButton: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  switchModeButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchModeText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  otpHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  otpTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  otpSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});

