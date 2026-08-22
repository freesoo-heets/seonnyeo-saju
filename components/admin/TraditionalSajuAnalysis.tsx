const positionName: Record<string, string> = {
  year: "년주",
  month: "월주",
  day: "일주",
  hour: "시주",
};


export default function TraditionalSajuAnalysis({
  twelveStates,
  nobleman,
  sinsal,
}: {
  twelveStates?: any;
  nobleman?: any;
  sinsal?: any;
}) {

  const stages =
    twelveStates?.stages ?? {};

  const hiddenStems =
    twelveStates?.hiddenStems ?? {};


  return (

    <div className="mt-8 space-y-8">


      {/* 십이운성 */}

      <section>

        <h3 className="text-lg font-bold text-neutral-950">
          십이운성
        </h3>

        <p className="mt-1 text-xs text-neutral-500">
          일간을 기준으로 각 지지의 기운 단계를 표시합니다.
        </p>


        <div className="mt-3 grid grid-cols-4 gap-2">

          {[
            "hour",
            "day",
            "month",
            "year",
          ].map(
            (
              position
            ) => (

              <div
                key={
                  position
                }
                className="rounded-2xl bg-[#faf7f2] p-4 text-center"
              >

                <div className="text-xs font-medium text-neutral-500">
                  {
                    positionName[
                      position
                    ]
                  }
                </div>

                <div className="mt-2 text-lg font-bold text-neutral-950">
                  {stages[
                    position
                  ] ?? "-"}
                </div>

              </div>

            )
          )}

        </div>

      </section>


      {/* 지장간 */}

      <section>

        <h3 className="text-lg font-bold text-neutral-950">
          지장간
        </h3>

        <p className="mt-1 text-xs text-neutral-500">
          각 지지 안에 숨어 있는 천간과 일간 기준 십신입니다.
        </p>


        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">

          {[
            "year",
            "month",
            "day",
            "hour",
          ].map(
            (
              position
            ) => {

              const items =
                hiddenStems[
                  position
                ] ?? [];

              return (

                <div
                  key={
                    position
                  }
                  className="rounded-2xl border border-neutral-100 bg-[#faf7f2] p-4"
                >

                  <div className="text-sm font-bold text-neutral-900">
                    {
                      positionName[
                        position
                      ]
                    }
                  </div>


                  {items.length >
                  0 ? (

                    <div className="mt-3 space-y-2">

                      {items.map(
                        (
                          item: any,
                          index: number
                        ) => (

                          <div
                            key={`${item.stem}-${index}`}
                            className="flex items-center justify-between rounded-xl bg-white px-3 py-2"
                          >

                            <div className="font-bold text-neutral-900">
                              {item.stem}
                            </div>

                            <div className="text-xs text-neutral-500">
                              {item.role}
                              {"  "}
                              {item.tenGod}
                            </div>

                          </div>

                        )
                      )}

                    </div>

                  ) : (

                    <div className="mt-3 text-sm text-neutral-400">
                      -
                    </div>

                  )}

                </div>

              );

            }
          )}

        </div>

      </section>


      {/* 귀인 */}

      <section>

        <h3 className="text-lg font-bold text-neutral-950">
          주요 귀인
        </h3>

        <p className="mt-1 text-xs text-neutral-500">
          일간을 기준으로 원국의 지지에서 확인합니다.
        </p>


        <div className="mt-3 grid gap-3 sm:grid-cols-3">

          <StarCard
            title="천을귀인"
            description="귀인  도움  위기 해결"
            data={
              nobleman?.cheonEul
            }
          />

          <StarCard
            title="문창귀인"
            description="학문  문서  표현"
            data={
              nobleman?.munChang
            }
          />

          <StarCard
            title="문곡귀인"
            description="감성  예술  표현력"
            data={
              nobleman?.munGok
            }
          />

        </div>

      </section>


      {/* 신살 */}

      <section>

        <h3 className="text-lg font-bold text-neutral-950">
          주요 신살
        </h3>

        <p className="mt-1 text-xs leading-5 text-neutral-500">
          년지와 일지를 각각 기준으로 삼합국을 계산합니다.
        </p>


        <div className="mt-3 grid gap-3 sm:grid-cols-3">

          <StarCard
            title="도화살"
            description="매력  관계  표현"
            data={
              sinsal?.peachBlossom
            }
          />

          <StarCard
            title="역마살"
            description="이동  변화  활동"
            data={
              sinsal?.travelHorse
            }
          />

          <StarCard
            title="화개살"
            description="사색  예술  정신성"
            data={
              sinsal?.hwagae
            }
          />

        </div>

      </section>


      <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-4 text-xs leading-5 text-neutral-500">

        신살과 십이운성은 만세력의 절대적인 천문 계산값과 달리
        적용 기준이 학파마다 달라질 수 있습니다.
        현재 화면은 선녀사주에서 채택한 기준에 따른 보조 해석 자료입니다.

      </div>

    </div>

  );
}


function StarCard({
  title,
  description,
  data,
}: {
  title: string;
  description: string;
  data?: any;
}) {

  const matches =
    data?.matches ?? [];

  const targets =
    data?.targets ?? [];


  return (

    <div
      className={`rounded-2xl border p-4 ${
        matches.length > 0
          ? "border-purple-200 bg-purple-50"
          : "border-neutral-100 bg-[#faf7f2]"
      }`}
    >

      <div className="flex items-center justify-between gap-2">

        <div className="font-bold text-neutral-950">
          {title}
        </div>

        {matches.length >
        0 ? (

          <span className="rounded-full bg-purple-100 px-2.5 py-1 text-[11px] font-bold text-purple-700">
            있음
          </span>

        ) : (

          <span className="rounded-full bg-neutral-200 px-2.5 py-1 text-[11px] font-medium text-neutral-600">
            없음
          </span>

        )}

      </div>


      <div className="mt-2 text-xs text-neutral-500">
        {description}
      </div>


      {targets.length >
        0 && (

        <div className="mt-3 text-xs text-neutral-600">

          기준 글자:

          {" "}

          <strong>
            {targets.join(
              "  "
            )}
          </strong>

        </div>

      )}


      {matches.length >
      0 && (

        <div className="mt-2 text-xs font-medium text-purple-700">

          위치:

          {" "}

          {matches
            .map(
              (
                item: string
              ) =>
                positionName[
                  item
                ] ??
                item
            )
            .join(
              "  "
            )}

        </div>

      )}

    </div>

  );
}
