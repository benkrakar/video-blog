import type { Module, ActionContext } from 'vuex'
import { auth } from '@/firebase'
import type firebase from 'firebase/compat/app'
import Cookies from 'js-cookie'

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth'

interface State {
  user: firebase.User | null
}

interface Actions {
  [key: string]: (context: ActionContext<State, any>, payload: any) => Promise<void>
  signIn(context: ActionContext<State, any>, { email, password }: { email: string, password: string }): Promise<void>
  signUp(context: ActionContext<State, any>, credentials: User): Promise<void>
  logOut(context: ActionContext<State, any>): Promise<void>
}

const state: State = {
  user: Cookies.get('loggedInUser') as unknown as firebase.User || null,
}

const mutations = {
  setUser(state: State, user: firebase.User | null) {
    state.user = user
    Cookies.set('loggedInUser', JSON.stringify(user))
  },
  clearUser(state: State) {
    state.user = null
    Cookies.remove('loggedInUser')
  }
}

const actions: Actions = {
  async signIn({ commit }, { email, password }) {
    await signInWithEmailAndPassword(auth, email, password)
    commit('setUser', auth.currentUser)
  },
  async signUp({ commit }, userInfo: User | null) {
    if (!userInfo) return
    const { password, email, photoURL, phoneNumber, fullName } = userInfo
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    if (!user) return
    const profileUpdates: any = {
      phoneNumber,
      displayName: fullName,
    }
    if (photoURL)  profileUpdates.photoURL = photoURL
    await updateProfile(user, profileUpdates)
    await sendEmailVerification(user)
  },

  async logOut({ commit }) {
    await signOut(auth)
    commit('clearUser')
  },
}

const authModule: Module<State, any> = {
  state,
  mutations,
  actions,
}

export default authModule
