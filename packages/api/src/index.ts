/** biome-ignore-all assist/source/organizeImports: we want to manually group exports by category */

/**
 * @universe/api - Unified data layer for Uniswap Universe
 *
 * This is the ONLY public entry point for the API package.
 * All exports must be explicitly listed here.
 * Deep imports are forbidden and will be blocked by ESLint.
 */

// Foundations
export { createFetchClient } from '@universe/api/src/clients/base/createFetchClient'
export {
  FetchError,
  is401Error,
  is404Error,
  isRateLimitFetchError,
} from '@universe/api/src/clients/base/errors'
export type {
  CustomOptions,
  FetchClient,
  StandardFetchOptions,
} from '@universe/api/src/clients/base/types'
export { SharedQueryClient } from '@universe/api/src/clients/base/SharedQueryClient'

// Constants and URLs
export {
  createHelpArticleUrl,
  DEV_ENTRY_GATEWAY_API_BASE_URL,
  getCloudflareApiBaseUrl,
  getCloudflarePrefix,
  getServicePrefix,
  helpUrl,
  PROD_ENTRY_GATEWAY_API_BASE_URL,
  STAGING_ENTRY_GATEWAY_API_BASE_URL,
  TrafficFlows,
} from '@universe/api/src/clients/base/urls'

// Auth
export type { AuthData, SignedRequestParams, SignMessageFunc } from '@universe/api/src/clients/base/auth'
export { createSignedRequestBody, createSignedRequestParams } from '@universe/api/src/clients/base/auth'

// GraphQL API
export * as GraphQLApi from '@universe/api/src/clients/graphql/generated'
export {
  useTokenBasicInfoPartsFragment,
  useTokenBasicProjectPartsFragment,
  useTokenMarketPartsFragment,
  useTokenProjectMarketsPartsFragment,
  useTokenProjectUrlsPartsFragment,
} from '@universe/api/src/clients/graphql/fragments'
export { GQLQueries } from '@universe/api/src/clients/graphql/queries'
export type { GqlResult } from '@universe/api/src/clients/graphql/types'
export { isError, isNonPollingRequestInFlight, isWarmLoadingStatus } from '@universe/api/src/clients/graphql/utils'

// Jupiter API
export {
  createJupiterApiClient,
  type JupiterApiClient,
} from '@universe/api/src/clients/jupiter/createJupiterApiClient'
export type {
  JupiterExecuteResponse,
  JupiterOrderResponse,
  JupiterExecuteUrlParams,
  JupiterOrderUrlParams,
} from '@universe/api/src/clients/jupiter/types'
export {
  jupiterExecuteResponseSchema,
  jupiterOrderResponseSchema,
} from '@universe/api/src/clients/jupiter/types'

// x0 API
//START ALPHA CHANGE 2145 -- export native 0x AllowanceHolder client and types from the API package --
export {
  createZeroExApiClient,
  ZERO_EX_SWAP_API_PATHS,
  type ZeroExApiClient,
} from '@universe/api/src/clients/zeroEx/createZeroExApiClient'
export type {
  ZeroExAddress,
  ZeroExAllowanceHolderPriceParams,
  ZeroExAllowanceHolderPriceResponse,
  ZeroExAllowanceHolderQuoteParams,
  ZeroExAllowanceHolderQuoteResponse,
  ZeroExAllowanceIssue,
  ZeroExBalanceIssue,
  ZeroExHex,
  ZeroExIssues,
  ZeroExRoute,
  ZeroExRouteFill,
  ZeroExRouteToken,
  ZeroExTransaction,
} from '@universe/api/src/clients/zeroEx/types'
//FINISH ALPHA CHANGE 2145 -- export native 0x AllowanceHolder client and types from the API package --

// Blockaid API
export {
  createBlockaidApiClient,
  type BlockaidApiClient,
} from '@universe/api/src/clients/blockaid/createBlockaidApiClient'
export {
  getBlockaidScanSiteResponseSchema,
  getBlockaidScanTransactionRequestSchema,
  getBlockaidScanTransactionResponseSchema,
  getBlockaidScanJsonRpcRequestSchema,
  DappVerificationStatus,
  type BlockaidScanSiteRequest,
  type BlockaidScanSiteResponse,
  type BlockaidScanSiteHitResponse,
  type BlockaidScanSiteMissResponse,
  type BlockaidScanTransactionRequest,
  type BlockaidScanTransactionResponse,
  type BlockaidScanJsonRpcRequest,
  type BlockaidScanJsonRpcResponse,
} from '@universe/api/src/clients/blockaid/types'

// Trading API
export * as TradingApi from '@universe/api/src/clients/trading/__generated__'
//START ALPHA CHANGE 2742 -- remove old Uniswap TradingApiClient and swappable-token public exports --
//FINISH ALPHA CHANGE 2742 -- remove old Uniswap TradingApiClient and swappable-token public exports --
export {
  FeeType,
  type FormattedUniswapXGasFeeInfo,
  type GasEstimate,
  type GasEstimateEip1559,
  type GasEstimateLegacy,
  type GasFeeResponse,
  type GasFeeResult,
  type GasFeeResultWithoutState,
  type GasStrategy,
  type TransactionEip1559FeeParams,
  type TransactionLegacyFeeParams,
} from '@universe/api/src/clients/trading/types'

// Liquidity Service API
export {
  createLiquidityServiceClient,
  type LiquidityServiceClient,
} from '@universe/api/src/clients/liquidity/createLiquidityServiceClient'
//START ALPHA CHANGE 4065 -- remove Toucan auction API exports from public API package --
//FINISH ALPHA CHANGE 4065 -- remove Toucan auction API exports from public API package --

// Uniswap API
export {
  createUniswapApiClient,
  type ScreenRequest,
  type ScreenResponse,
  type UniswapApiClient,
  type UniswapApiClientContext,
} from '@universe/api/src/clients/uniswap/createUniswapApiClient'

// Unitags API
export {
  type ProfileMetadata,
  type UnitagAddressesRequest,
  type UnitagAddressesResponse,
  type UnitagAddressRequest,
  type UnitagAddressResponse,
  type UnitagAvatarUploadCredentials,
  type UnitagChangeUsernameRequestBody,
  type UnitagClaim,
  type UnitagClaimContext,
  type UnitagClaimEligibilityRequest,
  type UnitagClaimEligibilityResponse,
  type UnitagClaimSource,
  type UnitagClaimUsernameRequestBody,
  type UnitagDeleteUsernameRequestBody,
  UnitagErrorCodes,
  type UnitagGetAvatarUploadUrlResponse,
  type UnitagResponse,
  type UnitagUpdateMetadataRequestBody,
  type UnitagUpdateMetadataResponse,
  type UnitagUsernameRequest,
  type UnitagUsernameResponse,
} from '@universe/api/src/clients/unitags/types'
export { createUnitagsApiClient } from '@universe/api/src/clients/unitags/createUnitagsApiClient'

// Data API Service (ConnectRPC - listTopTokens, listTopPools, getPortfolio, etc.)
export {
  createDataApiServiceClient,
  type DataApiServiceClient,
  type DataApiServiceClientContext,
} from '@universe/api/src/clients/dataApi/createDataApiServiceClient'
export {
  getGetPortfolioQueryOptions,
  type GetPortfolioQueryParams,
} from '@universe/api/src/clients/dataApi/getGetPortfolioQueryOptions'
export {
  TopPoolsOrderBy,
  TopTokensOrderBy,
  type GetPortfolioRequest,
  type GetPortfolioResponse,
  type ListTopPoolsResponse,
  type ListTopTokensResponse,
} from '@uniswap/client-data-api/dist/data/v1/api_pb'
export { ProtocolVersion } from '@uniswap/client-data-api/dist/data/v1/poolTypes_pb'
export { type Pool as DataApiPool, type Token as DataApiToken } from '@uniswap/client-data-api/dist/data/v1/types_pb'

// Data Service API
export {
  createDataServiceApiClient,
  type DataServiceApiClient,
  type DataServiceApiClientContext,
  TokenReportEventType,
  ReportAssetType,
} from '@universe/api/src/clients/data/createDataServiceApiClient'

// Notifications API
export { createNotificationsApiClient } from '@universe/api/src/clients/notifications/createNotificationsApiClient'
export { BackgroundType, ContentStyle, OnClickAction } from '@universe/api/src/clients/notifications/types'
export type {
  AckNotificationRequest,
  AckNotificationResponse,
  GetNotificationsRequest,
  GetNotificationsResponse,
  InAppNotification,
  NotificationsApiClient,
  NotificationsClientContext,
} from '@universe/api/src/clients/notifications/types'

//START ALPHA CHANGE 4071 -- remove FOR API exports after pruning fiat on/off-ramp clients --
//FINISH ALPHA CHANGE 4071 -- remove FOR API exports after pruning fiat on/off-ramp clients --

// ConnectRPC API
export {
  ALL_NETWORKS_ARG,
  createConnectTransportWithDefaults,
  type ConnectRpcContext,
} from '@universe/api/src/connectRpc/base'
export {
  parseProtectionInfo,
  parseRestProtocolVersion,
  parseSafetyLevel,
  transformInput,
  type WithoutWalletAccount,
} from '@universe/api/src/connectRpc/utils'

//START ALPHA CHANGE 3574 -- remove deleted conversion tracking API export --
//FINISH ALPHA CHANGE 3574 -- remove deleted conversion tracking API export --

// Embedded Wallet API
export {
  createEmbeddedWalletApiClient,
  type EmbeddedWalletApiClient,
  type EmbeddedWalletClientContext,
} from '@universe/api/src/clients/embeddedWallet/createEmbeddedWalletApiClient'

// Other Utilities
export {
  createFetcher,
  objectToQueryString,
} from '@universe/api/src/clients/base/utils'

//START ALPHA CHANGE 1746 -- remove public session bootstrap exports after pruning the remaining session bootstrap path from this fork --

// Session Transport (pure factory, no platform detection)
//FINISH ALPHA CHANGE 1746 -- remove public session bootstrap exports after pruning the remaining session bootstrap path from this fork --
export { createSessionTransport, type CreateSessionTransportOptions } from '@universe/api/src/session'

export type {
  UseQueryApiHelperHookArgs,
  UseQueryWithImmediateGarbageCollectionApiHelperHookArgs,
} from '@universe/api/src/hooks/shared/types'
export { useQueryWithImmediateGarbageCollection } from '@universe/api/src/hooks/shared/useQueryWithImmediateGarbageCollection'

// Other Types
export {
  CustomRankingType,
  RankingType,
  SpamCode,
} from '@universe/api/src/clients/content/types'

export { getTransport } from '@universe/api/src/transport'

//START ALPHA CHANGE 4072 -- stop exporting removed FOR entry-gateway URL helper --
export { getEntryGatewayUrl } from '@universe/api/src/getEntryGatewayUrl'
//FINISH ALPHA CHANGE 4072 -- stop exporting removed FOR entry-gateway URL helper --

export { getWebSocketUrl } from '@universe/api/src/getWebSocketUrl'

export { provideUniswapIdentifierService } from '@universe/api/src/provideUniswapIdentifierService'
