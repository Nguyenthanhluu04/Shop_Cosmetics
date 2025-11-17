     bảng `users`
    #	Name	Type	Collation	Attributes	Null	Default	Comments	Extra	Action
    1	id Primary	int(11)			No	None		AUTO_INCREMENT	Change Change	Drop Drop
    2	tenKH	varchar(50)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    3	email	varchar(100)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    4	pass	varchar(100)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    5	role	varchar(30)	utf8mb4_general_ci		No	None			Change Change	Drop





     bảng `products`

# Name Type Collation Attributes Null Default Comments Extra Action

    1	id Primary	int(11)			No	None		AUTO_INCREMENT	Change Change	Drop Drop
    2	title	varchar(200)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    3	urlImg	text	utf8mb4_general_ci		Yes	NULL			Change Change	Drop Drop
    4	priceOld	varchar(30)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    5	priceNew	varchar(30)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    6	quantity	int(11)			No	None			Change Change	Drop Drop
    7	sold	varchar(30)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    8	brand	varchar(30)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    9	nation	varchar(30)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    10	evaluate	varchar(30)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    11	discount	varchar(30)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    12	size	varchar(50)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    13	available	varchar(30)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    14	iddm	int(11)			Yes	NULL			Change Change	Drop Drop

    bảng `category`

    	#	Name	Type	Collation	Attributes	Null	Default	Comments	Extra	Action
    1	id Primary	int(11)			No	None		AUTO_INCREMENT	Change Change	Drop Drop
    2	loaisanpham	varchar(50)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop

bảng `orders`

# Name Type Collation Attributes Null Default Comments Extra Action

    1	id Primary	int(11)			No	None		AUTO_INCREMENT	Change Change	Drop Drop
    2	customerName	varchar(100)	utf8mb4_general_ci		No	None			Change Change	Drop Drop
    3	email	varchar(100)	utf8mb4_general_ci		Yes	NULL			Change Change	Drop Drop
    4	phoneNumber	int(11)			No	None			Change Change	Drop Drop
    5	yourAddress	varchar(255)	utf8mb4_general_ci		No	None			Change Change	Drop Drop
    6	img	varchar(255)	utf8mb4_general_ci		No	None			Change Change	Drop Drop
    7	productName	varchar(150)	utf8mb4_general_ci		No	None			Change Change	Drop Drop
    8	quantity	int(11)			No	None			Change Change	Drop Drop
    9	totalAmount	varchar(20)	utf8mb4_general_ci		No	None			Change Change	Drop Drop
    10	status Index	enum('pending', 'confirmed', 'processing', 'shippi...	utf8mb4_general_ci		Yes	pending			Change Change	Drop Drop
    11	payment_method	enum('cod', 'banking', 'momo')	utf8mb4_general_ci		Yes	cod			Change Change	Drop Drop
    12	note	text	utf8mb4_general_ci		Yes	NULL			Change Change	Drop Drop
    13	created_at Index	timestamp			No	current_timestamp()			Change Change	Drop Drop
    14	updated_at	timestamp			No	current_timestamp()		ON UPDATE CURRENT_TIMESTAMP()	Change Change	Drop Drop
    15	userId Index	int(11)			No	None			Change Change	Drop Drop

bảng ` address`

    	#	Name	Type	Collation	Attributes	Null	Default	Comments	Extra	Action
    1	id Primary	int(11)			No	None		AUTO_INCREMENT	Change Change	Drop Drop
    2	userId Index	int(11)			No	None			Change Change	Drop Drop
    3	userName	varchar(100)	utf8mb4_general_ci		No	None			Change Change	Drop Drop
    4	phoneNumber	varchar(11)	utf8mb4_general_ci		No	None			Change Change	Drop Drop
    5	userAddress	varchar(255)	utf8mb4_general_ci		No	None			Change Change	Drop Drop

bảng ` order_details`

# Name Type Collation Attributes Null Default Comments Extra Action

    1	id Primary	int(11)			No	None		AUTO_INCREMENT	Change Change	Drop Drop
    2	order_id Index	int(11)			No	None			Change Change	Drop Drop
    3	product_id Index	int(11)			No	None			Change Change	Drop Drop
    4	product_name	varchar(200)	utf8mb4_unicode_ci		No	None			Change Change	Drop Drop
    5	product_image	text	utf8mb4_unicode_ci		Yes	NULL			Change Change	Drop Drop
    6	price	varchar(30)	utf8mb4_unicode_ci		No	None			Change Change	Drop Drop
    7	quantity	int(11)			No	None			Change Change	Drop Drop
    8	subtotal	varchar(30)	utf8mb4_unicode_ci		No	None			Change Change	Drop Drop
