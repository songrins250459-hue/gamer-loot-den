import { loadTossPayments } from "@tosspayments/payment-sdk";

const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY ?? "test_ck_KNbdOvk5rkWX19R4L5Knrn07xlzm";

const getSuccessUrl = () => `${window.location.origin}/payment/success`;
const getFailUrl = () => `${window.location.origin}/payment/fail`;

interface RequestOptions {
  amount: number;
  orderId: string;
  orderName: string;
  customerName?: string;
}

export const requestTossPayment = async ({ amount, orderId, orderName, customerName }: RequestOptions) => {
  if (!CLIENT_KEY) {
    throw new Error("토스 클라이언트 키가 설정되지 않았습니다.");
  }

  const tossPayments = await loadTossPayments(CLIENT_KEY);

  await tossPayments.requestPayment("CARD", {
    amount,
    orderId,
    orderName,
    customerName,
    successUrl: getSuccessUrl(),
    failUrl: getFailUrl(),
  });
};

