import { cloneDeep } from 'lodash';
import {
  GOERLI,
  GOERLI_CHAIN_ID,
  KOVAN,
  KOVAN_CHAIN_ID,
  MAINNET,
  MAINNET_CHAIN_ID,
  NETWORK_TYPE_RPC,
  RINKEBY,
  RINKEBY_CHAIN_ID,
  ROPSTEN,
  ROPSTEN_CHAIN_ID,
} from '../../../shared/constants/network';

const version = 52;

/**
 * Migrate tokens in Preferences to be keyed by chainId instead of
 * providerType. To prevent breaking user's MetaMask and selected
 * tokens, this migration copies the RPC entry into *every* custom RPC
 * chainId.
 */
export default {
  version,
  async migrate(originalVersionedData) {
    const versionedData = cloneDeep(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  },
};

function transformState(state = {}) {
  if (state.PreferencesController) {
    const {
      accountTokens,
      accountHiddenTokens,
      frequentRpcListDetail,
    } = state.PreferencesController;

    const newAccountTokens = {};
    const newAccountHiddenTokens = {};

    for (const account of Object.keys(accountTokens)) {
      for (const providerType of Object.keys(accountTokens[account])) {
        switch (providerType) {
          case MAINNET:
            newAccountTokens[account][MAINNET_CHAIN_ID] =
              accountTokens[account][MAINNET];
            break;
          case ROPSTEN:
            newAccountTokens[account][ROPSTEN_CHAIN_ID] =
              accountTokens[account][ROPSTEN];
            break;
          case RINKEBY:
            newAccountTokens[account][RINKEBY_CHAIN_ID] =
              accountTokens[account][RINKEBY];
            break;
          case GOERLI:
            newAccountTokens[account][GOERLI_CHAIN_ID] =
              accountTokens[account][GOERLI];
            break;
          case KOVAN:
            newAccountTokens[account][KOVAN_CHAIN_ID] =
              accountTokens[account][KOVAN];
            break;
          case NETWORK_TYPE_RPC:
            frequentRpcListDetail.forEach((detail) => {
              newAccountTokens[account][detail.chainId] =
                accountTokens[account][NETWORK_TYPE_RPC];
            });
            break;
          default:
            break;
        }
      }
    }

    for (const account of Object.keys(accountHiddenTokens)) {
      for (const providerType of Object.keys(accountHiddenTokens[account])) {
        switch (providerType) {
          case MAINNET:
            newAccountHiddenTokens[account][MAINNET_CHAIN_ID] =
              accountHiddenTokens[account][MAINNET];
            break;
          case ROPSTEN:
            newAccountHiddenTokens[account][ROPSTEN_CHAIN_ID] =
              accountHiddenTokens[account][ROPSTEN];
            break;
          case RINKEBY:
            newAccountHiddenTokens[account][RINKEBY_CHAIN_ID] =
              accountHiddenTokens[account][RINKEBY];
            break;
          case GOERLI:
            newAccountHiddenTokens[account][GOERLI_CHAIN_ID] =
              accountHiddenTokens[account][GOERLI];
            break;
          case KOVAN:
            newAccountHiddenTokens[account][KOVAN_CHAIN_ID] =
              accountHiddenTokens[account][KOVAN];
            break;
          case NETWORK_TYPE_RPC:
            frequentRpcListDetail.forEach((detail) => {
              newAccountHiddenTokens[account][detail.chainId] =
                accountHiddenTokens[account][NETWORK_TYPE_RPC];
            });
            break;
          default:
            break;
        }
      }
    }

    state.PreferencesController.accountHiddenTokens = newAccountHiddenTokens;
    state.PreferencesController.accountTokens = newAccountTokens;
  }
  return state;
}
