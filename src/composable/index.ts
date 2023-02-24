import { followOrUnfollow } from '@/services/consult'
import type { Doctor, FollowType } from '@/types/consult'

export const useFollow = (type: FollowType = 'doc') => {
  const follow = async (item: Doctor) => {
    await followOrUnfollow(item.id, type)
    item.likeFlag = item.likeFlag === 1 ? 0 : 1
  }
  return { follow }
}
