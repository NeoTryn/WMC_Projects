import { prisma } from './prisma.server'
import { Prisma } from '@prisma/client'

export const createKudo = async (message: string, userId: number, recipientId: number, backgroundColor: string, textColor: string, emoji: string) => {
  await prisma.kudo.create({
    data: {
      // 1
      message,
      backgroundColor,
      textColor,
      emoji,

      // 2
      author: {
        connect: {
          id: userId,
        },
      },
      recipient: {
        connect: {
          id: recipientId,
        },
      },
    },
  })
}

export const getFilteredKudos = async (
    userId: number,
    sortFilter: Prisma.KudoOrderByWithRelationInput,
    whereFilter: Prisma.KudoWhereInput,
  ) => {
    return await prisma.kudo.findMany({
      select: {
        id: true,
        textColor: true,
        backgroundColor: true,
        emoji: true,
        message: true,
        author: {
          select: {
            profile: true,
          },
        },
      },
      orderBy: {
        ...sortFilter,
      },
      where: {
        recipientId: userId,
        ...whereFilter,
      },
    })
  }

  export const getRecentKudos = async () => {
  return await prisma.kudo.findMany({
    take: 3,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      emoji: true,
      recipient: {
        select: {
          id: true,
          profile: true,
        },
      },
    },
  })
}