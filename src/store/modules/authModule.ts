import type { Module, ActionContext } from 'vuex'
import { auth } from '@/firebase'
import type firebase from 'firebase/compat/app'
import type  UserInfo from 'firebase/compat/app'

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
  signUp(context: ActionContext<State, any>,  { email, password }: { email: string, password: string }): Promise<void>
  updateProfile(context: ActionContext<State, any>, credentials: User): Promise<void>
  logOut(context: ActionContext<State, any>): Promise<void>
}

const state: State = {
  user: null,
}

const mutations = {
  setUser(state: State, user: firebase.User | null) {
    state.user = user
  },
}

const actions: Actions = {
  async signIn({ commit }, { email, password }) {
    await signInWithEmailAndPassword(auth, email, password)
    commit('setUser', auth.currentUser)
  },

  async signUp({ commit }, { email, password}) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    if (user) {
      await sendEmailVerification(user);
      commit('setUser', user);
    }
  },

  async updateProfile({ commit }, userInfo: User | null ) {
    if (userInfo) {
    const {photoURL, phoneNumber, fullName } = userInfo
      // @ts-ignore
      const user = await updateProfile(state.user as any, { photoURL: photoURL, phoneNumber:phoneNumber,  displayName: fullName });
      commit('setUser', user);
    }
  },

  async logOut({ commit }) {
    await signOut(auth)
    commit('setUser', null)
  },
}

const authModule: Module<State, any> = {
  state,
  mutations,
  actions,
}

export default authModule
