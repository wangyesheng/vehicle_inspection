import {
    getShareImageRes
} from "../api";

export default {
    onShareTimeline(_) {
        const appUser = this.getAppUser();
        let query;
        if (appUser.member_mobile) {
            query = `sharerId=${appUser.member_id}`;
        }
        const {
            data: {
                sharepic
            }
        } = await getShareImageRes()
        return {
            query,
            title: "汽车年审，还可以更快更简单",
            imageUrl: sharepic,
        };
    },
};