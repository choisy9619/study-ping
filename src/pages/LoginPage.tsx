// 로그인 페이지

import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button, Input, Card } from '../components/ui'
import { useAuth } from '../hooks'
import { validateEmail } from '../utils'
import { ROUTES } from '../constants'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // 에러 클리어
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.'
    }
    
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.'
    }
    
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await login(formData)
      navigate(ROUTES.DASHBOARD)
    } catch (error: any) {
      setErrors({ submit: error.message || '로그인에 실패했습니다.' })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            출석체크잇
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            스터디 출석 체크 및 커뮤니티
          </p>
        </div>

        {/* 로그인 폼 */}
        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="이메일"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="이메일을 입력하세요"
              required
            />

            <Input
              label="비밀번호"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="비밀번호를 입력하세요"
              required
            />

            {errors.submit && (
              <div className="text-red-600 text-sm text-center">
                {errors.submit}
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
            >
              로그인
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              아직 계정이 없으신가요?{' '}
              <Link
                to={ROUTES.SIGNUP}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                회원가입
              </Link>
            </p>
            
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
