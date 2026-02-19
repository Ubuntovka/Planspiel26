// app/wam/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

  <!-- Base Data structure shared by Node and Edge -->
  <xs:complexType name="DataType">
    <xs:sequence>
      <xs:element name="Name" type="xs:string"/>
      <xs:element name="Type" type="xs:string"/>
      <xs:element name="Cost" type="xs:integer"/>
      <xs:element name="Extra" type="ExtraType" minOccurs="0"/>
    </xs:sequence>
  </xs:complexType>

  <!-- Extra data varies by node/edge type -->
  <xs:complexType name="ExtraType">
    <xs:sequence minOccurs="0">
      <!-- Common fields across multiple node types -->
      <xs:element name="Location" type="xs:string" minOccurs="0"/>
      <xs:element name="CertificateId" type="xs:string" minOccurs="0"/>
      
      <!-- Node-specific fields -->
      <xs:element name="AllocateIP" type="xs:string" minOccurs="0"/>
      <xs:element name="EncryptionType" type="xs:string" minOccurs="0"/>
      <xs:element name="SignInSupport" type="xs:string" minOccurs="0"/>
      <xs:element name="SessionTimeout" type="xs:string" minOccurs="0"/>
      <xs:element name="Protocols" type="xs:string" minOccurs="0"/>
      <xs:element name="AuthenticationType" type="xs:string" minOccurs="0"/>
      <xs:element name="Format" type="xs:string" minOccurs="0"/>
      <xs:element name="Size" type="xs:string" minOccurs="0"/>
      <xs:element name="Source" type="xs:string" minOccurs="0"/>
      <xs:element name="Algorithm" type="xs:string" minOccurs="0"/>
      <xs:element name="Accuracy" type="xs:string" minOccurs="0"/>
      <xs:element name="ModelFamily" type="xs:string" minOccurs="0"/>
      <xs:element name="ModelVersion" type="xs:string" minOccurs="0"/>
      <xs:element name="SystemPrompt" type="xs:string" minOccurs="0"/>
      <xs:element name="Temperature" type="xs:string" minOccurs="0"/>
      <xs:element name="MaxTokens" type="xs:string" minOccurs="0"/>
      <xs:element name="KnowledgeBase" type="xs:string" minOccurs="0"/>
      <xs:element name="Provider" type="xs:string" minOccurs="0"/>
      <xs:element name="ApiQuota" type="xs:string" minOccurs="0"/>
      <xs:element name="LatencyTarget" type="xs:string" minOccurs="0"/>
      
      <!-- Edge-specific fields -->
      <xs:element name="AuthStrategy" type="xs:string" minOccurs="0"/>
      <xs:element name="Issuer" type="xs:string" minOccurs="0"/>
      <xs:element name="Scopes" type="xs:string" minOccurs="0"/>
      <xs:element name="Verification" type="xs:string" minOccurs="0"/>
      <xs:element name="Protocol" type="xs:string" minOccurs="0"/>
      <xs:element name="Path" type="xs:string" minOccurs="0"/>
      <xs:element name="Method" type="xs:string" minOccurs="0"/>
      <xs:element name="Timeout" type="xs:string" minOccurs="0"/>
      <xs:element name="LegacyProtocol" type="xs:string" minOccurs="0"/>
      <xs:element name="ConnectionMethod" type="xs:string" minOccurs="0"/>
      <xs:element name="Maintenance" type="xs:string" minOccurs="0"/>
    </xs:sequence>
  </xs:complexType>

  <!-- Position coordinates -->
  <xs:complexType name="PositionType">
    <xs:attribute name="x" type="xs:integer" use="required"/>
    <xs:attribute name="y" type="xs:integer" use="required"/>
  </xs:complexType>

  <!-- Size dimensions -->
  <xs:complexType name="SizeType">
    <xs:attribute name="width" type="xs:integer" use="required"/>
    <xs:attribute name="height" type="xs:integer" use="required"/>
  </xs:complexType>

  <!-- Style properties -->
  <xs:complexType name="StyleType">
    <xs:sequence>
      <xs:element name="Stroke" type="xs:string"/>
      <xs:element name="StrokeWidth" type="xs:integer"/>
    </xs:sequence>
  </xs:complexType>

  <!-- Marker end properties -->
  <xs:complexType name="MarkerEndType">
    <xs:sequence>
      <xs:element name="Type" type="xs:string"/>
      <xs:element name="Color" type="xs:string"/>
    </xs:sequence>
  </xs:complexType>

  <!-- Node definition -->
  <xs:complexType name="NodeType">
    <xs:sequence>
      <xs:element name="Label" type="xs:string"/>
      <xs:element name="Position" type="PositionType"/>
      <xs:element name="Size" type="SizeType"/>
      <xs:element name="Data" type="DataType"/>
    </xs:sequence>
    <xs:attribute name="id" type="xs:string" use="required"/>
    <xs:attribute name="type" type="xs:string" use="required"/>
  </xs:complexType>

  <!-- Edge definition -->
  <xs:complexType name="EdgeType">
    <xs:sequence>
      <xs:element name="Source" type="xs:string"/>
      <xs:element name="Target" type="xs:string"/>
      <xs:element name="SourceHandle" type="xs:string"/>
      <xs:element name="TargetHandle" type="xs:string"/>
      <xs:element name="Label" type="xs:string"/>
      <xs:element name="Style" type="StyleType"/>
      <xs:element name="MarkerEnd" type="MarkerEndType"/>
      <xs:element name="Data" type="DataType"/>
    </xs:sequence>
    <xs:attribute name="id" type="xs:string" use="required"/>
    <xs:attribute name="type" type="xs:string" use="required"/>
  </xs:complexType>

  <!-- Root Diagram element -->
  <xs:element name="Diagram">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="Nodes">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="Node" type="NodeType" maxOccurs="unbounded"/>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
        <xs:element name="Edges">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="Edge" type="EdgeType" maxOccurs="unbounded"/>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
    </xs:complexType>
  </xs:element>

</xs:schema>

`;

  return new NextResponse(xml.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'Content-Disposition': 'inline; filename="wam.xsd"',
    },
  });
}
