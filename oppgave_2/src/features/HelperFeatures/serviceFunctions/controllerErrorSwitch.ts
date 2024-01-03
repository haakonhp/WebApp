import {NextResponse} from "next/server";
import {errorCodes} from "@/types/errorCodes";

export function produceNextResponseError(error: errorCodes, dbError: string | undefined): NextResponse {
    switch (error) {
        case errorCodes.NO_CONTENT:
            return NextResponse.json({success: true, data: {data: null, error: "Request yielded no results.", rootCause: dbError}}, {status: 404})
        case errorCodes.ELEMENT_DOES_NOT_EXIST:
            return NextResponse.json({success: false, data: {data: null, error: "Element with the given identification does not exist.", rootCause: dbError}}, {status: 404})
        case errorCodes.DUPLICATE_DATABASE_ENTRY:
            return NextResponse.json({success: false, data: {data: null, error: "Element either already exists, or an insert using the same unique attribute is attempted.", rootCause: dbError}}, {status: 409})
        case errorCodes.JOINING_ERROR:
            return NextResponse.json({success: false, data: {data: null, error: "One or more connecting elements does not exist, operation aborted.", rootCause: dbError}}, {status: 400})
        case errorCodes.VALIDATION_ERROR: {
            return NextResponse.json({success: false, data: {data: null, error: "Error matching provided attributes when creating element.", rootCause: dbError}}, {status: 400})}
        case errorCodes.ATTRIBUTES_CLASHING: {
            return NextResponse.json({success: false, data: {data: null, error: "Element contains two or more attributes that are mutually exclusive.", rootCause: dbError}}, {status: 400})}
        case errorCodes.LACKING_QUERY_ELEMENTS: {
                return NextResponse.json({success: false, data: {data: null, error: "Lacking query elements to fulfill request.", rootCause: dbError}}, {status: 400})
        }
        case errorCodes.LACKING_PERFORMANCE_DATA: {
            return NextResponse.json({success: false, data: {data: null, error: "Creating activities without first having metadata is disallowed.", rootCause: dbError}}, {status: 400})
        }
    }
    return NextResponse.json({success: false, data: {data: null, error: "Generic error occurred."}}, {status: 500})
}