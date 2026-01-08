// app/wam/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const xml = `
<?xml version="1.0" encoding="utf-8"?>
<xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="Diagram">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="Nodes">
          <xs:complexType>
            <xs:sequence>
              <xs:element maxOccurs="unbounded" name="Node">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Label" type="xs:string" />
                    <xs:element name="Position">
                      <xs:complexType>
                        <xs:attribute name="x" type="xs:short" use="required" />
                        <xs:attribute name="y" type="xs:short" use="required" />
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="Size">
                      <xs:complexType>
                        <xs:attribute name="width" type="xs:unsignedByte" use="required" />
                        <xs:attribute name="height" type="xs:unsignedByte" use="required" />
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                  <xs:attribute name="id" type="xs:string" use="required" />
                  <xs:attribute name="type" type="xs:string" use="required" />
                </xs:complexType>
              </xs:element>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
        <xs:element name="Edges">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="Edge">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="Source" type="xs:string" />
                    <xs:element name="Target" type="xs:string" />
                  </xs:sequence>
                  <xs:attribute name="id" type="xs:string" use="required" />
                  <xs:attribute name="type" type="xs:string" use="required" />
                </xs:complexType>
              </xs:element>
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
