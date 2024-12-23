import bcrypt from 'bcryptjs'
import type { RegisterForm } from './types.server'
import { prisma } from './prisma.server'
import { Profile } from '@prisma/client'

export const createUser = async (user: RegisterForm) => {
    const passwordHash = await bcrypt.hash(user.password, 10)
    const newUser = await prisma.user.create({
        data: {
            email: user.email,
            password: passwordHash,
            profile: {
                create: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            },
        },
    })
    return { id: newUser.id, email: user.email }
}

export const getOtherUsers = async (userId: number) => {
    return prisma.user.findMany({
    include: {
        profile: true,
    },
        where: {
            id: { not: userId },
        },
        orderBy: {
            profile: {
                firstName: 'asc',
            },
        },
    })
}

export const getUserById = async (userId: number) => {
    return await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }, // Profile-Daten einbinden
    })
}

export const updateUser = async (userId: number, profile: Partial<Profile>) => {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profile: {
          update: profile,
        },
      },
    });
  };

  export const deleteUser = async (id: number) => {
    await prisma.user.delete({ where: { id } });
  };