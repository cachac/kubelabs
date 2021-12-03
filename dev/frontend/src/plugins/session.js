export const Session = {
  state: true,
  token: null,
  fingerPrint: null,
  getFingerPrint() {
    if (!this.fingerPrint) {
      this.fingerPrint = "Kubelabs";
    }
    return this.fingerPrint;
  },
  end() {
    this.state = false;
    this.token = null;
    localStorage.removeItem(this.getFingerPrint());
  },
  set(t) {
    localStorage.setItem(this.getFingerPrint(), JSON.stringify(t));
    this.token = JSON.stringify(t);
  },
  get() {
    if (!this.token) {
      const eLocal = localStorage.getItem(this.getFingerPrint()) || null;
      if (eLocal) this.token = eLocal;
    }

    return JSON.parse(this.token);
  },
};

export default {
  install(Vue /* options */) {
    // eslint-disable-next-line prefer-const
    let app = new Vue({
      data() {
        return {
          session: Session,
        };
      },
      methods: {
        end(session) {
          this.session.end(session);
        },
        set(token) {
          this.session.set(token);
        },
        get() {
          this.session.get();
        },
      },
    });
    Vue.prototype.$session = app.session;
  },
};
