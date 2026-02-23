import {
  Tag,
  Type as TypeIcon,
  Calculator,
  LinkIcon,
  Info,
} from "lucide-react";

export const ADDITIONAL_FIELDS: Record<
  string,
  {
    label: string;
    key: string;
    icon: any;
    placeholder?: string;
    type?: "select" | "text";
    options?: string[];
    description?: string;
  }[]
> = {
  applicationNode: [
    {
      label: "Location",
      key: "location",
      icon: <TypeIcon size={14} />,
      placeholder: "Base URL (e.g. https://...)",
      description: "The root URL where the application is hosted.",
    },
    {
      label: "Certificate ID",
      key: "certificateId",
      icon: <Tag size={14} />,
      placeholder: "X509 key identifier",
      description:
        "The unique identifier for the SSL/TLS certificate used by this application.",
    },
    {
      label: "Sign-In Support",
      key: "signInSupport",
      icon: <Calculator size={14} />,
      placeholder: "Boolean (true/false)",
      description: "Indicates if the application supports user authentication.",
    },
    {
      label: "Session Timeout",
      key: "sessionTimeout",
      icon: <Calculator size={14} />,
      placeholder: "Minutes before invalid",
      description: "The duration of inactivity before a user session expires.",
    },
  ],

  serviceNode: [
    {
      label: "Location",
      key: "location",
      icon: <TypeIcon size={14} />,
      placeholder: "Service endpoint URL",
      description: "The specific API endpoint URL for this service.",
    },
    {
      label: "Certificate ID",
      key: "certificateId",
      icon: <Tag size={14} />,
      placeholder: "Service certificate ID",
      description:
        "The certificate ID required for secure service-to-service communication.",
    },
    {
      label: "Valid protocols",
      key: "protocols",
      icon: <Tag size={14} />,
      placeholder: "Valid service protocol",
      description:
        "Supported communication protocols (e.g., REST, SOAP, gRPC).",
    },
    {
      label: "Authentication Type",
      key: "authenticationType",
      icon: <Tag size={14} />,
      placeholder: "Authentication type",
      description:
        "The method used to authenticate requests (e.g., Bearer Token, API Key).",
    },
  ],
  dataProviderNode: [
    {
      label: "Data Type",
      key: "dataType",
      icon: <TypeIcon size={14} />,
      placeholder: "(e.g., XML/JSON)",
      description: "The data type for the data the data provider provides",
    },
    {
      label: "Data Source",
      key: "dataSource",
      icon: <TypeIcon size={14} />,
      placeholder: "Source URI",
      description: "The location URI the data is coming from",
    },
  ],
  identityProviderNode: [
    {
      label: "Issuer",
      key: "issuer",
      icon: <Tag size={14} />,
      placeholder: "(e.g., SAML/JWT)",
      description: "Authentication data type",
    },
    {
      label: "Session Timeout",
      key: "sessionTimeout",
      icon: <Calculator size={14} />,
      placeholder: "Minutes at IP",
    },
  ],
  processUnitNode: [
    {
      label: "Functionality",
      key: "functionality",
      icon: <Tag size={14} />,
      placeholder: "Description of functionality",
    },
  ],
  datasetNode: [
    {
      label: "Format",
      key: "format",
      icon: <TypeIcon size={14} />,
      placeholder: "e.g., CSV, JSON",
      description: "The data structure format of the dataset.",
    },
    {
      label: "Size",
      key: "size",
      icon: <Calculator size={14} />,
      placeholder: "e.g., 500MB",
      description: "The total storage size or estimated volume of the data.",
    },
    {
      label: "Source",
      key: "source",
      icon: <Tag size={14} />,
      placeholder: "Data source description",
      description: "The origin or system from which this data is collected.",
    },
  ],

  aiProcessNode: [
    {
      label: "Algorithm",
      key: "algorithm",
      icon: <TypeIcon size={14} />,
      placeholder: "e.g., Neural Network",
      description:
        "The specific machine learning algorithm or logic used in this process.",
    },
    {
      label: "Accuracy",
      key: "accuracy",
      icon: <Calculator size={14} />,
      placeholder: "e.g., 95%",
      description:
        "The measured or target performance accuracy for this model.",
    },
  ],

  securityRealmNode: [
    {
      label: "Location",
      key: "location",
      icon: <TypeIcon size={14} />,
      placeholder: "STS base URL",
      description: "The base URL for the Security Token Service (STS).",
    },
    {
      label: "Allocate IP",
      key: "allocateIP",
      icon: <TypeIcon size={14} />,
      placeholder: "IDP redirect URL",
      description: "The endpoint for the Identity Provider (IDP) redirection.",
    },
    {
      label: "Encryption Type",
      key: "encryptionType",
      icon: <TypeIcon size={14} />,
      placeholder: "e.g., AES, RSA",
      description:
        "The cryptographic algorithm used for securing data within this realm.",
    },
  ],

  aiApplicationNode: [
    {
      label: "Model Family",
      key: "modelFamily",
      icon: <Tag size={14} />,
      placeholder: "e.g., GPT-4, Claude 3.5",
      description:
        "The broader category or lineage of the AI model being used.",
    },
    {
      label: "Specific Version",
      key: "modelVersion",
      icon: <Calculator size={14} />,
      placeholder: "e.g., turbo-preview",
      description:
        "The exact version or snapshot of the model to ensure reproducibility.",
    },
    {
      label: "System Prompt",
      key: "systemPrompt",
      icon: <TypeIcon size={14} />,
      placeholder: "Define AI role...",
      description:
        "The core instructions that guide the AI behavior and persona.",
    },
    {
      label: "Temperature",
      key: "temperature",
      icon: <Calculator size={14} />,
      placeholder: "0.0 to 1.0",
      description:
        "Controls randomness: 0 is deterministic, 1 is highly creative.",
    },
    {
      label: "Max Tokens",
      key: "maxTokens",
      icon: <Calculator size={14} />,
      placeholder: "Max response length",
      description:
        "The maximum limit of tokens allowed in the generated response.",
    },
    {
      label: "Knowledge Base",
      key: "knowledgeBase",
      icon: <Tag size={14} />,
      placeholder: "RAG source or Vector DB ID",
      description:
        "Reference to the external data used for Retrieval Augmented Generation (RAG).",
    },
  ],

  aiServiceNode: [
    {
      label: "Provider",
      key: "provider",
      icon: <Tag size={14} />,
      type: "select",
      options: [
        "OpenAI",
        "Anthropic",
        "Google Cloud",
        "AWS Bedrock",
        "Azure OpenAI",
        "Self-Hosted",
      ],
      placeholder: "Select a provider",
      description: "The platform or company providing the AI infrastructure.",
    },
    {
      label: "Model Version",
      key: "modelVersion",
      icon: <Tag size={14} />,
      placeholder: "Active version info",
      description: "The version of the service API currently in use.",
    },
    {
      label: "Endpoint URL",
      key: "location",
      icon: <TypeIcon size={14} />,
      placeholder: "https://api...",
      description: "The dedicated API gateway URL for the AI service.",
    },
    {
      label: "API Quota",
      key: "apiQuota",
      icon: <Calculator size={14} />,
      placeholder: "RPM limit",
      description: "The maximum number of requests permitted per minute (RPM).",
    },
    {
      label: "Latency Target",
      key: "latencyTarget",
      icon: <Calculator size={14} />,
      placeholder: "e.g., 200ms",
      description: "The desired response time threshold for the service.",
    },
  ],
};

export const EDGE_ADDITIONAL_FIELDS: Record<string, any[]> = {
  invocation: [
    {
      label: "Protocol",
      key: "protocol",
      icon: <TypeIcon size={14} />,
      type: "select",
      options: [
        "REST API",
        "SOAP",
        "gRPC",
        "GraphQL",
        "WebSocket",
        "Webhook",
        "Other",
      ],
      placeholder: "Select protocol type",
      description:
        "The communication standard or architectural style used for this connection.",
    },
    {
      label: "Custom Protocol",
      key: "customProtocol",
      icon: <TypeIcon size={14} />,
      placeholder: "e.g. MQTT, AMQP, Thrift",
      condition: (data: any) => data.protocol === "Other",
    },
    {
      label: "Endpoint Path",
      key: "path",
      icon: <LinkIcon size={14} />,
      placeholder: "e.g. /api/v1/resource",
      description: "The target URI path, resource identifier, or action name.",
    },
    {
      label: "Method",
      key: "method",
      type: "select",
      options: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      icon: <Tag size={14} />,
      condition: (data: any) => data.protocol === "REST API",
    },
    {
      label: "SOAP Action",
      key: "soapAction",
      icon: <Tag size={14} />,
      placeholder: "e.g. GetUserDetails",
      description: "The specific operation defined in the SOAP message header.",
      condition: (data: any) => data.protocol === "SOAP",
    },
    {
      label: "WSDL URL",
      key: "wsdl",
      icon: <LinkIcon size={14} />,
      placeholder: "https://example.com/service?wsdl",
      description:
        "The location of the Web Services Description Language file.",
      condition: (data: any) => data.protocol === "SOAP",
    },
    {
      label: "Event Type",
      key: "eventType",
      icon: <Tag size={14} />,
      placeholder: "e.g. subscribe, publish, message",
      description:
        "The specific event or message type for full-duplex communication.",
      condition: (data: any) => data.protocol === "WebSocket",
    },
    {
      label: "Trigger Event",
      key: "triggerEvent",
      icon: <Tag size={14} />,
      placeholder: "e.g. payment.captured, order.created",
      description:
        "The external event that initiates this callback or webhook.",
      condition: (data: any) => data.protocol === "Webhook",
    },
    {
      label: "Timeout (ms)",
      key: "timeout",
      icon: <Calculator size={14} />,
      placeholder: "e.g. 5000",
      description: "Maximum time in milliseconds to wait for a response.",
    },
  ],
  trust: [
    {
      label: "Auth Strategy",
      key: "authStrategy",
      icon: <Tag size={14} />,
      type: "select",
      options: ["OAuth2/OIDC", "JWT", "mTLS", "API Key", "SAML 2.0"],
      description:
        "The mechanism used to establish a trusted identity between services.",
    },
    {
      label: "Token Issuer",
      key: "issuer",
      icon: <LinkIcon size={14} />,
      placeholder: "https://auth.example.com",
      description:
        "The authority (IdP/STS) that issues and signs the security tokens.",
    },
    {
      label: "Allowed Scopes",
      key: "scopes",
      icon: <Tag size={14} />,
      placeholder: "e.g. openid, profile, read:user",
      description:
        "The specific permissions or scopes granted via this trust relationship.",
    },
    {
      label: "Verification Info",
      key: "verification",
      icon: <Info size={14} />,
      placeholder: "e.g. JWKS URL or Public Key ID",
      description:
        "How the receiving service verifies the authenticity of the token.",
    },
  ],
  legacy: [
    {
      label: "Legacy System Type",
      key: "legacyProtocol",
      icon: <TypeIcon size={14} />,
      type: "select",
      options: [
        "SOAP (Legacy)",
        "FTP/SFTP",
        "Telnet",
        "Direct DB Link",
        "Custom",
      ],
      description:
        "An outdated or proprietary protocol used for connecting to legacy environments.",
    },
    {
      label: "Custom Type",
      key: "customLegacyProtocol",
      icon: <TypeIcon size={14} />,
      placeholder: "Specify protocol name",
      condition: (data: any) => data.legacyProtocol === "Custom",
    },
    {
      label: "Certificate ID",
      key: "certificateId",
      icon: <Tag size={14} />,
      placeholder: "X.509 Thumbprint or ID",
      description:
        "The unique identifier for the digital certificate required for secure handshake.",
    },
    {
      label: "Connection Method",
      key: "connectionMethod",
      type: "select",
      options: [
        "VPN Tunnel",
        "Direct Connect",
        "Reverse Proxy",
        "IP Whitelist",
      ],
      icon: <LinkIcon size={14} />,
      description:
        "The network-level connection strategy used to bridge the environments.",
    },
    {
      label: "Maintenance Window",
      key: "maintenance",
      icon: <Calculator size={14} />,
      placeholder: "e.g. Sun 01:00-05:00 UTC",
      description:
        "Scheduled downtime or synchronization cycles of the legacy system.",
    },
  ],
};