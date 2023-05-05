import type { Module, ActionContext } from 'vuex'
import { auth } from '@/firebase/config'
import type firebase from 'firebase/compat/app'

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

  async signUp({ commit }, userInfo: User) {
    const { fullName, email, password } = userInfo
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    if (user) {
      await updateProfile(user, { displayName: fullName });
      await sendEmailVerification(user);
      commit('setUser', user);
    }
    commit('setUser', auth.currentUser)
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
