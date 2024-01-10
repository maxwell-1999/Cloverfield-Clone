import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import useActiveWagmi from "@symmio/frontend-sdk/lib/hooks/useActiveWagmi";
import {
  useActiveAccount,
  useAddInWhitelist,
  useIsWhiteList,
  useUserWhitelist,
} from "@symmio/frontend-sdk/state/user/hooks";
import { GetWhiteListType } from "@symmio/frontend-sdk/state/user/types";
import { WEB_SETTING } from "@symmio/frontend-sdk/config";
import { useMultiAccountContract } from "@symmio/frontend-sdk/hooks/useContract";

export default function Updater() {
  const { account } = useActiveWagmi();
  const subAccount = useActiveAccount();
  const MultiAccountContract = useMultiAccountContract();

  const [whitelist, setWhitelist] = useState<null | boolean>(null);
  const [subWhitelist, setSubWhitelist] = useState<null | boolean>(null);

  const userIsWhitelist = useUserWhitelist();
  const getSubAccountWhitelist = useIsWhiteList(
    subAccount?.accountAddress,
    MultiAccountContract?.address
  );
  const addInWhitelist = useAddInWhitelist(
    subAccount?.accountAddress,
    MultiAccountContract?.address
  );

  useEffect(() => {
    if (account && subAccount && whitelist && subWhitelist == false) {
      addInWhitelist()
        .then((res: GetWhiteListType | null) => {
          // response
          // SUCCESS : {'successful'=True, message=''}
          // FAILED : {'successful'=False, message=''}
          // EXISTS : {'successful'=False, message='exists'}
          if (res?.successful) {
            setSubWhitelist(true);
            toast.success("Activating succeeded");
          } else if (!res?.successful && res?.message === "exists") {
            setSubWhitelist(true);
          } else {
            setSubWhitelist(null);
            toast.error("Not activated");
          }
        })
        .catch(() => {
          WEB_SETTING.checkWhiteList && toast.error("Not activated");
        });
    }
  }, [addInWhitelist, subWhitelist, whitelist, account, subAccount]);

  useEffect(() => {
    if (subAccount)
      getSubAccountWhitelist()
        .then((res) => {
          setSubWhitelist(res);
        })
        .catch(() => {
          setSubWhitelist(null);
        });
  }, [getSubAccountWhitelist, subAccount]);

  useEffect(() => {
    if (userIsWhitelist) setWhitelist(true);
  }, [userIsWhitelist]);

  return <></>;
}
