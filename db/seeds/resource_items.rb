if ResourceItem.count.zero?
    customer1 = Customer.first
    customer2 = Customer.second

    customer1.resource_items.create!(
        name: "Video 1",
        link_url: "https://www.youtube.com/watch?v=p5rQHoaQpTw",
        resource_type: "video",
        is_deleted: false
    )

    customer2.resource_items.create!(
        name: "Link 1",
        link_url: "https://www.youtube.com/watch?v=p5rQHoaQpTw",
        resource_type: "link",
        is_deleted: false
    )
end