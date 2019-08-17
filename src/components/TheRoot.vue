<template>
  <section>
    <img
      width="100%"
      src="https://firebasestorage.googleapis.com/v0/b/necocha-me.appspot.com/o/logo.png?alt=media&token=e84771e8-f590-4a4b-a2f9-06dca4712490"
    />
    <div v-if="authPending">
      <img style="margin: 0 auto;" src="https://loading.io/spinners/palette-ring/index.svg" />
    </div>
    <div v-if="creator">
      {{creator.name}}にとくめいでチャットしますか？
      <button type="button" @click="createChat">チャットする</button>
    </div>
    <div v-if="user">
      <a
        :href="'https://twitter.com/intent/tweet?text=だれかとくめいのネコになってお話ししてくれませんか？送る側だけとくめいのチャット、ネコチャしよう！%20%23とくめいチャット%20%23ネコチャ&url=' + encodeURIComponent(
         `https://${window.location.host}/?creatorUid=${user.uid}`)"
      >あなたのリンクをTwitterで共有する</a>
      <div v-for="{uid,creatorName,expireAt,isCreator} in chats" v-bind:key="expireAt">
        <a :href="`./?chatUid=${uid}&expireAt=${expireAt}`">
          {{isCreator ? 'とくめいのネコ':creatorName}}さんとのチャット
          あと{{computeDate(expireAt).slice(0,computeDate(expireAt).length-1)}}
        </a>
      </div>
    </div>
    <div class="description">
      <p>ネコチャはとくめいのネコとチャットすることができるサービスです。</p>
      <p>ルームを作成してリンクを共有すると、みんなはあなたととくめいでチャットすることができます。</p>
      <p>ルームは6時間で誰もアクセス出来なくなります。</p>
      <button type="button" @click="clickHandler">Googleではじめる</button>
      <p>とくめいのネコを募集して、エモいひとときをお楽しみ下さい。</p>
    </div>
    <img
      width="100%"
      src="https://firebasestorage.googleapis.com/v0/b/necocha-me.appspot.com/o/sample.png?alt=media&token=66991375-4adc-44cb-8e48-6ed5469cf712"
    />
    <button type="button" @click="clickHandler">Googleではじめる</button>
  </section>
</template>

<script>
import $ from "jquery";
import firebase from "firebase";
import "moment/locale/ja";

import moment from "moment";
// import 'moment/locale/ja'

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export default {
  name: "TheRoot",
  props: ["chats", "user", "authPending", "clickHandler"],
  data() {
    return {
      creator: null,
      window: {}
    };
  },
  computed: {
    chatData: () => {
      this.chats.map(chat => {
        return { uid: Object.keys(chat)[0], ...Object.values(chat) };
      });
    }
  },
  created: async function() {
    this.window = window;
    const url = new URL(location.href);
    const creatorUid = url.searchParams.get("creatorUid"); // "/ca
    if (creatorUid) {
      const creatorSnap = await firebase
        .database()
        .ref("users/" + creatorUid)
        .once("value");
      this.creator = creatorSnap.val();

      this.creator.uid = creatorUid;
    }
    const refChats = firebase.database().ref("chats");
    refChats.on("child_added", snap => {
      // if (!this.user.chats) {
      //   return
      // }
      // const newChat = snap.val()
      // if (this.user.chats[snap.key] === 'creator') {
      //   this.chats.creator.push(newChat)
      // } else if (this.user.chats[snap.key] === 'guest') {
      //   this.chats.guest.push(newChat)
      // }
    });
  },
  methods: {
    createChat: async function() {
      if (!this.user) {
        alert("Googleログインが必要です(名前は相手には分かりません)");
        return;
      }
      if (!(this.user && this.creator)) {
        return;
      }
      const refChats = firebase.database().ref("chats");
      const expireAt = Date.now() + 1000 * 60 * 60 * 6;
      const chatUid = refChats.push().getKey();
      const refUser = firebase.database().ref("users");
      const updateObj = {};
      updateObj["name"] = this.user.displayName;
      updateObj["chats/" + chatUid] = "guest";
      refUser.child(this.user.uid).update(updateObj);
      await refChats
        .child(chatUid)
        .set({ creatorName: this.creator.name, expireAt });
      delete updateObj.name;
      updateObj["chats/" + chatUid] = "creator";
      await refUser.child(this.creator.uid).update(updateObj);
      const refMembers = await firebase
        .database()
        .ref("members/" + chatUid)
        .set({ [this.user.uid]: "guest", [this.creator.uid]: "creator" });
      await firebase
        .database()
        .ref("messages/" + chatUid)
        .push({
          image:
            "https://firebasestorage.googleapis.com/v0/b/necocha-io.appspot.com/o/animal_mark04_neko.png?alt=media&token=ba4e9920-bf1f-45ea-a3e6-0a34e3a85b21",
          message: "こんにちは！とくめいのネコさんが入室しました！By運営",
          isFromGuest: true
        });
      return (location = `/?chatUid=${chatUid}&expireAt=${expireAt}`);
    },
    computeDate(timestamp) {
      return moment(timestamp).fromNow();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
section {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}
.description {
  margin-top: 10px;
  line-height: 30px;
  padding: 0 50px;
}
button {
  border: none;
  border-radius: 2px;
  margin: 10px 0;
  color: white;
  font-size: 20px;
  background-color: #3ab383;
}

p {
  margin-bottom: 5px;
}
.ribbon11 {
  margin-bottom: 30px;
  display: inline-block;
  position: relative;
  height: 45px;
  vertical-align: middle;
  text-align: center;
  box-sizing: border-box;
}
.ribbon11:before {
  /*左側のリボン端*/
  content: "";
  position: absolute;
  width: 10px;
  bottom: -10px;
  left: -35px;
  z-index: -2;
  border: 20px solid #6cbf86;
  border-left-color: transparent; /*山形に切り抜き*/
}

.ribbon11:after {
  /*右側のリボン端*/
  content: "";
  position: absolute;
  width: 10px;
  bottom: -10px;
  right: -35px;
  z-index: -2;
  border: 20px solid #6cbf86;
  border-right-color: transparent; /*山形に切り抜き*/
}

.ribbon11 h3 {
  display: inline-block;
  position: relative;
  margin: 0;
  padding: 0 20px;
  line-height: 45px;
  font-size: 15px;
  color: #fff;
  background: #42bc8e; /*真ん中の背景色*/
}
.ribbon11 h3:before {
  position: absolute;
  content: "";
  top: 100%;
  left: 0;
  border: none;
  border-bottom: solid 10px transparent;
  border-right: solid 15px #318c69; /*左の折り返し部分*/
}
.ribbon11 h3:after {
  position: absolute;
  content: "";
  top: 100%;
  right: 0;
  border: none;
  border-bottom: solid 10px transparent;
  border-left: solid 15px #318c69; /*右の折り返し部分*/
}
</style>
