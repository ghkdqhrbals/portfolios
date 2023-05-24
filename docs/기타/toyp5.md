---
layout: default
title: 🍖 근처 맛집 추천 프로젝트
parent: 📌 토이 프로젝트
nav_order: 5
---

**해당 프로젝트는 학사 진행 중, 안드로이드 텀 프로젝트로 진행한 맛집 찾기 프로젝트입니다.**

* 참여인원 : 8인 팀(팀원 역할)
* 기간 : 2019년 04월 ~ 2019년 05월(2개월)
* 나의 역할
   * ✍️ kakao 지도에서 맛집을 크롤링하는 알고리즘 제작
* Github : [https://github.com/pnu-005-team1/projectTeam1](https://github.com/pnu-005-team1/projectTeam1) 

### 📃 **✍️ kakao 지도에서 맛집 크롤러 제작**

<details><summary> 셀레니움 크롤러 코드 </summary><div markdown="1">

```java
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

public class Daum {

	static String Daum_map_URL = "https://map.kakao.com";
	static String busan = "부산";
	static String[] busan_gu = { "강서구", "금정구", "남구", "동구", "동래구", "진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구",
			"중구", "해당대구", "기장군" };
	static String[] menu = { "돈가스" };
	static int count = 0;

	static int count2 = 0;
	static ArrayList<String> all = new ArrayList<>();

	static ArrayList<String> restaurant = new ArrayList<>();
	// 음식점 메뉴와 가격들을 (메뉴, 가격, ......., "\\", 메뉴, 가격, .......,"\",...)이런 식으로 결정
	static ArrayList<String> menu2 = new ArrayList<>();

	// 각각의 음식점 상세보기 클릭시 들어가는 page의 url List
	static ArrayList<String> places = new ArrayList<>();

	private static void sleep() {
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			System.out.println(e.getMessage());
		}
	}

	private static void getMenu(WebDriver driver2) {
		ChromeDriver driver = new ChromeDriver();
		driver.manage().timeouts().pageLoadTimeout(10, TimeUnit.SECONDS);
		driver.manage().timeouts().setScriptTimeout(20, TimeUnit.SECONDS);
		driver.get(places.get(count2++));
		sleep();
		for (int i = 0; i < 1; i++) {

			// 메뉴 펼치기.
			for (int j = 0; j < 5; j++) {
				try {

					driver.findElement(By.xpath("//*[@id=\"mArticle\"]/div[2]/a/span[1]")).click();
					System.out.println("더보기 클릭");
					sleep();

					// #mArticle > div.cont_menu > a 메뉴 펼치기.
					// //*[@id="mArticle"]/div[2]/a/span[1]
					// //*[@id="mArticle"]/div[2]/a/span[1]
					// #mArticle > div.cont_menu > a 메뉴접기
					// //*[@id="mArticle"]/div[2]/a/span[2]

					// 1번째 메뉴 #mArticle > div.cont_menu > ul > li.nophoto_type.menu_fst > div > span
					// 2번째 메뉴 #mArticle > div.cont_menu > ul > li:nth-child(2) > div > span
					// 1번째 가격 #mArticle > div.cont_menu > ul > li.nophoto_type.menu_fst > div >
					// em.price_menu
					// 2번째 가격 #mArticle > div.cont_menu > ul > li:nth-child(2) > div > em.price_menu
					// #mArticle > div.cont_menu > ul > li.nophoto_type.opened_last > div > span
					// #mArticle > div.cont_menu > ul > li:nth-child(21) > div > span
					// #mArticle > div.cont_menu > ul > li.nophoto_type.opened_last > div > span
					// #mArticle > div.cont_menu > ul > li.nophoto_type.opened_last > div >
					// em.price_menu
				} catch (Exception e) {
					System.out.println("메뉴 더보기 X");
				}
			}
			try {
				menu2.add(driver.findElement(By.cssSelector("#mArticle > div.cont_essential > div:nth-child(1) > div.place_details > div > h2")).getText());
				String a = driver
						.findElement(By
								.cssSelector("#mArticle > div.cont_menu > ul > li.nophoto_type.menu_fst > div > span"))
						.getText();
				String b = driver
						.findElement(By.cssSelector(
								"#mArticle > div.cont_menu > ul > li.nophoto_type.menu_fst > div > em.price_menu"))
						.getText();
				menu2.add(a);
				menu2.add(b);
				for (int j = 2; j < 30; j++) {
					a = driver.findElement(
							By.cssSelector("#mArticle > div.cont_menu > ul > li:nth-child(" + j + ") > div > span"))
							.getText();
					b = driver
							.findElement(By.cssSelector(
									"#mArticle > div.cont_menu > ul > li:nth-child(" + j + ") > div > em.price_menu"))
							.getText();
					menu2.add(a);
					menu2.add(b);
					System.out.println("메뉴추가");
					
				}
			} catch (Exception e) {
				System.out.println("메뉴 X");
			}

			System.out.println(menu2);
			menu2.add("\\");
			driver.quit();
		}
	}

	// click후 그 리스트에 있는 15개의 attribute를 가져오는 함수
	public static void getDadd(WebDriver driver) {

		driver.findElement(By.cssSelector("#info\\2e search\\2e place\\2e more")).click();
		// page 넘어가는 term
		sleep();

		driver.findElement(By.cssSelector("#info\\2e search\\2e page\\2e no2")).click();
		sleep();
		// 1,2,3,4,5page 16개 line 읽는 함수.
		while (true) {
			try {
				for (int i = 1; i < 6; i++) {
					try {
						// page 넘어가는 시간
						driver.findElement(By.cssSelector("#info\\2e search\\2e page\\2e no" + i)).click();
						sleep();
						for (int j = 1; j < 16; j++) {
							String a = driver
									.findElement(By.cssSelector("#info\\2e search\\2e place\\2e list > li:nth-child("
											+ j + ") > div.head_item.clickArea > strong > a.link_name"))
									.getText();
							String b = driver
									.findElement(By.cssSelector("#info\\2e search\\2e place\\2e list > li:nth-child("
											+ j + ") > div.info_item > div.addr > p:nth-child(1)"))
									.getText();
							restaurant.add(a);
							restaurant.add(b);
							count++;

							String c = driver
									.findElement(By.cssSelector("#info\\.search\\.place\\.list > li:nth-child(" + j
											+ ") > div.info_item > div.contact.clickArea > a.moreview"))
									.getAttribute("href");
							places.add(c);

						}
						System.out.println("next page");
					} catch (Exception e) {
						System.out.println("16개 X");
						return;
					}
					// 4번째 A
					// #info\2e search\2e place\2e list > li:nth-child(1) > div.head_item.clickArea
					// > strong > a.link_name
					// #info\2e search\2e place\2e list > li:nth-child(15) > div.head_item.clickArea
					// > strong > a.link_name

					// 별점 1번째 A
					// #info\.search\.place\.list > li:nth-child(1) > div.rating.clickArea >
					// span.score > em
					// #info\.search\.place\.list > li:nth-child(2) > div.rating.clickArea >
					// span.score > em

					// 상세보기 1번째 A
					// #info\.search\.place\.list > li:nth-child(1) > div.info_item >
					// div.contact.clickArea > a.moreview
				}
				driver.findElement(By.cssSelector("#info\\2e search\\2e page\\2e next")).click();
				sleep();
			} catch (Exception e) {
				System.out.println(e.getMessage());
			}
		}
		// 1번째 A 주소 #info\2e search\2e place\2e list > li:nth-child(1) > div.info_item >
		// div.addr > p:nth-child(1)
		// 1번째 B 주소 #info\2e search\2e place\2e list > li:nth-child(2) > div.info_item >
		// div.addr > p:nth-child(1)
		// #info\2e search\2e page\2e no3
		// #info\2e search\2e page\2e no4
		// 5번째 A
		// #info\2e search\2e place\2e list > li:nth-child(1) > div.head_item.clickArea
		// > strong > a.link_name
		// 16page
		// #info\2e search\2e page\2e no1

	}

	public static void crawler() throws IOException {
		// 셀레니움 셋팅
		if (System.getProperty("os.name").toLowerCase().indexOf("window") > -1) {
			System.setProperty("webdriver.chrome.driver",
					"C:\\Users\\ghkdq\\Desktop\\chromedriver_win32 (2)\\chromedriver.exe");
		}

		ChromeDriver driver = new ChromeDriver();
		driver.manage().timeouts().pageLoadTimeout(10, TimeUnit.SECONDS);
		driver.manage().timeouts().setScriptTimeout(20, TimeUnit.SECONDS);

		driver.get(Daum_map_URL);
		WebElement webElement = null;
		driver.findElement(By.xpath("/html/body/div[10]/div/div[2]/a")).click();
		driver.findElement(By.xpath("/html/body/div[10]/div/div/div/span")).click();

		// driver.switchTo().frame(driver.findElement(By.className("box_searchbar")));

		webElement = driver.findElement(By.id("search.keyword.query"));
		String city = "부산";
		for (String i : busan_gu) {
			all.add(city + " " + i + " " + menu[0]);
		}
		webElement.sendKeys(all.get(0));
		// 부산 금정구 구서동 click
		driver.findElement(By.xpath("//*[@id=\"search.keyword.submit\"]")).click();
		// click후 term
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			System.out.println(e.getMessage());
		}

		getDadd(driver);
		
		
		System.out.println("Finish");
		
		for (int i = 0; i < count; i++) {
			getMenu(driver);
		}
		count = 0;

	}

	public static void main(String[] args) {

		try {
			crawler();
			System.out.println(restaurant);

		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

</div></details>