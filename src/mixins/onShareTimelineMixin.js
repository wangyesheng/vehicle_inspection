export default {
    onShareTimeline(_) {
        const appUser = this.getAppUser();
        let query;
        if (appUser.member_mobile) {
            query = `sharerId=${appUser.member_id}`;
        }
        return {
            query,
            title: "汽车年审，还可以更快更简单",
            imageUrl: `https://cj.huazhe.work/images/huodong.png?timespan=${new Date().getTime()}`,
        };
    },
};