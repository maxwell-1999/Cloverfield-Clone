import React, { useEffect, useState } from "react";
import styled from "styled-components";

import {
  usePositionType,
  useStopLossValues,
} from "@symmio/frontend-sdk/state/trade/hooks";
import { ApplicationModal } from "@symmio/frontend-sdk/state/application/reducer";
import { useActiveMarket } from "@symmio/frontend-sdk/state/trade/hooks";
import { TransactionType } from "@symmio/frontend-sdk/state/transactions/types";
import { useIsHavePendingTransaction } from "@symmio/frontend-sdk/state/transactions/hooks";
import {
  useModalOpen,
  useToggleOpenPositionModal,
} from "@symmio/frontend-sdk/state/application/hooks";

import { ModalState, StateContext } from "./ModalData";

import Loading from "./Loading";
import ProgressTab from "./ProgressTab";
import SetStopLoss from "./SetStopLoss";
import OpenPositionData from "./OpenPositionData";
import Column from "components/Column";
import { ModalHeader, Modal } from "components/Modal";

const Wrapper = styled(Column)`
  gap: 16px;
  padding: 0px 12px 12px;
  margin-top: -11px;
  overflow-y: scroll;
  height: auto;
`;

export default function OpenPositionModal() {
  const { isActive } = useStopLossValues();
  const [state, setState] = useState<ModalState>(ModalState.START);
  const [txHash, setTxHash] = useState("");
  const isPendingTxs = useIsHavePendingTransaction(TransactionType.TRADE);

  const market = useActiveMarket();
  const positionType = usePositionType();
  const toggleModal = useToggleOpenPositionModal();
  const modalOpen = useModalOpen(ApplicationModal.OPEN_POSITION);

  useEffect(() => {
    if (txHash !== "" && !isPendingTxs) {
      if (isActive) setState(ModalState.END);
      else toggleModal();
    }
  }, [isPendingTxs, txHash]);

  const content =
    state === ModalState.START ? (
      <OpenPositionData />
    ) : state === ModalState.LOADING ? (
      <Loading summary={"Transaction Pending..."} />
    ) : (
      <SetStopLoss />
    );

  return (
    <Modal
      isOpen={modalOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >
      <ModalHeader
        onClose={toggleModal}
        title={`${positionType} ${market?.symbol}-${market?.asset}`}
        positionType={positionType}
      />
      <StateContext.Provider value={{ state, setState, setTxHash }}>
        <Wrapper>
          {isActive && <ProgressTab />}
          {content}
        </Wrapper>
      </StateContext.Provider>
    </Modal>
  );
}
