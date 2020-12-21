import { useAtom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { Card, Tag } from "antd";
import { useEffect } from "react";
import { me } from "../../api-service";
import { app, creds, profile, axios } from "../../App.atom";

export const AuthHome = () => {
  const [state] = useAtom(app);
  const { username } = useAtomValue(creds);
  const { emailId, admin = false } = useAtomValue(profile);
  const request = useUpdateAtom(axios);

  useEffect(() => {
    request({
      target: profile,
      read: me,
      transformData: ({ data }) => data,
    });
  }, [request]);

  const loading = state.loading;
  const color = admin ? "blue" : "geekblue";

  return (
    <Card
      title="Welcome user!!"
      loading={loading}
      className="full-inner-card-body"
    >
      <Tag color={color}>{`Username : ${username}`}</Tag>
      <Tag color={color}>{`Email-id : ${emailId}`}</Tag>
      <Tag color={color}>{admin ? "admin" : "non-admin"}</Tag>
    </Card>
  );
};
