// Code generated by tygo. DO NOT EDIT.

//////////
// source: obj.go

export interface Pagination {
	current_page: Page;
	per_page: number /* int */;
	total_pages: number /* int64 */;
	total_items: number /* int64 */;
}
export interface Page {
	num: number /* int */;
	size: number /* int */;
	is_last: boolean;
	is_empty: boolean;
	first_idx: number /* int */;
	last_idx: number /* int */;
	first_id?: string;
	last_id?: string;
}

//////////
// source: params.go

export interface Params {
	page: number /* int */;
	per_page: number /* int */;
	skip_to_id: any;
}
