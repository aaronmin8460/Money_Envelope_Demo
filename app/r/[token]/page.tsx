import ReceiveClient from "./ReceiveClient";

export default async function Page({
  params,
}: {
  params: { token: string } | Promise<{ token: string }>;
}) {
  const { token } = await Promise.resolve(params);
  return <ReceiveClient token={token} />;
}